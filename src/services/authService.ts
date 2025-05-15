import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../types';
import apiService from './apiService';

// This is a mock service that would interact with an API in a real application
export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    try {
      const response = await apiService.post<User>('/auth/login', {
        email,
        password,
      });

      // Store user data in localStorage (in a real app, store the token)
      localStorage.setItem('authMealsUser', JSON.stringify(response ? (response as any).data : ''));
      localStorage.setItem('authMealsUserTokens', JSON.stringify(response ? (response as any).tokens : ''));

      return response;

    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration Invalid email or password');
    }
  },
  
  async register(userData: any, role: UserRole): Promise<User> {
    try {
      // Basic validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('All fields are required');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Make an API call to register the user
      const response = await apiService.post<User>('/auth/register', {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role,
      });

      // Store user data in localStorage
      localStorage.setItem('authMealsUser', JSON.stringify(response ? (response as any).data : ''));
      localStorage.setItem('authMealsUserTokens', JSON.stringify(response ? (response as any).tokens : ''));

      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('authMealsUser');
      
      if (!userData) {
        return Promise.reject('No user found');
      }

      const user = JSON.parse(userData);

      // Validate UUID format
      if (!user.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)) {
        // If the stored user has an invalid UUID, generate a new one
        user.id = uuidv4();
        localStorage.setItem('authMealsUser', JSON.stringify(user));
      }
      
      return Promise.resolve(user);
    } catch (error) {
      // Handle any JSON parsing errors or other issues
      localStorage.removeItem('authMealsUser'); // Clear potentially corrupted data
      return Promise.reject('Invalid user data');
    }
  },
  
  logout(): void {
    // Clear user data from localStorage
    localStorage.removeItem('authMealsUser');
  }
};