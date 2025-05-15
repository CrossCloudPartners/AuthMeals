import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

class ApiService {
  private apiClient: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseURL: string) {
    this.apiClient = axios.create({
      baseURL,
      timeout: 5000, // Set a timeout for requests
    });

    // Add a request interceptor to include headers
    this.apiClient.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // const accessToken = localStorage.getItem('access_token');
        const tokenData = localStorage.getItem('authMealsUserTokens') as any;
        let access_token = '';
        if(tokenData) {
          const { access: { token } } = JSON.parse(tokenData);
          access_token = token;
        }
        if (access_token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
          };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to handle 401 errors
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const newToken = await this.refreshToken();
              this.isRefreshing = false;
              this.onTokenRefreshed(newToken);
              return this.apiClient(originalRequest);
            } catch (refreshError) {
              this.isRefreshing = false;
              this.clearSession();
              return Promise.reject(refreshError);
            }
          }

          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.apiClient(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Refresh the token
  private async refreshToken(): Promise<string> {
    try {
      const tokenData = localStorage.getItem('authMealsUserTokens');
      const { refresh: { token } } = tokenData ? JSON.parse(tokenData) : null;

      if (!token) {
        throw new Error('No refresh token available');
      }
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, 
      { 
        refresh_token: token 
      });

      const newTokens = response.data;

      // Update tokens in localStorage
      localStorage.setItem('authMealsUserTokens', JSON.stringify(newTokens));

      return newTokens.access.token;
    } catch (error) {
      this.clearSession();
      throw new Error('Failed to refresh token');
    }
  }

  // Clear session data
  private clearSession() {
    localStorage.removeItem('authMealsUserTokens');
    localStorage.removeItem('authMealsUser');
    window.location.href = '/login'; // Redirect to login page
  }

  // Notify all subscribers with the new token
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  // Add a subscriber to the token refresh queue
  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  // GET request
  public async get<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'GET request failed');
    }
  }

  // POST request
  public async post<T>(url: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.post(url, data);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'POST request failed');
    }
  }

  // POST request
  public async postForm<T>(url: string, data: FormData): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'POST Form request failed');
    }
  }

  // DELETE request
  public async delete<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.delete(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'DELETE request failed');
    }
  }
}

// Export an instance of the service with the base URL
const apiService = new ApiService(API_BASE_URL || ''); // Replace with your API base URL
export default apiService;