import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../types';

// This is a mock service that would interact with an API in a real application
export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, accept any email that ends with @test.com
        if (email.endsWith('@test.com') && password.length >= 6) {
          const role: UserRole = email.includes('vendor') ? 'vendor' : 'consumer';
          
          const userData: User = {
            id: uuidv4(), // Generate a valid UUID
            email,
            firstName: 'Demo',
            lastName: 'User',
            role,
            createdAt: new Date().toISOString(),
          };
          
          // Store user data in localStorage (in a real app, store the token)
          localStorage.setItem('authMealsUser', JSON.stringify(userData));
          
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },
  
  async register(userData: any, role: UserRole): Promise<User> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
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
          
          // Create user object with UUID
          const user: User = {
            id: uuidv4(), // Generate a valid UUID
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: role,
            createdAt: new Date().toISOString(),
          };
          
          // Store user data in localStorage
          localStorage.setItem('authMealsUser', JSON.stringify(user));
          
          resolve(user);
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
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