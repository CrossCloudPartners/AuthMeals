import { Meal } from '../types';
import apiService from './apiService';

const mealService = {
  async fetchMeals(): Promise<Meal[]> {
    return await apiService.get<Meal[]>('/meal');
  },

  async addMeal(mealData: FormData): Promise<Meal> {
    return await apiService.postForm<Meal>('/meal', mealData);
  },

  async deleteMeal(mealId: string): Promise<void> {
    await apiService.delete(`/meal/${mealId}`);
  },
};

export default mealService;
