import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

class ApiService {
  private apiClient: AxiosInstance;

  constructor(baseURL: string) {
    this.apiClient = axios.create({
      baseURL,
      timeout: 5000, // Set a timeout for requests
    });

    // Add a request interceptor to include headers
    this.apiClient.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
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
}

// Export an instance of the service with the base URL
const apiService = new ApiService(API_BASE_URL || ''); // Replace with your API base URL
export default apiService;