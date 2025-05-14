import { Meal } from '../types';
import apiService from './apiService';

const mealService = {
  async fetchMeals(): Promise<Meal[]> {
    return await apiService.get<Meal[]>('/meal');
  },

  async addMeal(mealData: Meal): Promise<Meal> {
    return await apiService.post<Meal>('/meal', mealData);
  },

  async deleteMeal(mealId: string): Promise<void> {
    await apiService.delete(`/meal/${mealId}`);
  },
};

export default mealService;
