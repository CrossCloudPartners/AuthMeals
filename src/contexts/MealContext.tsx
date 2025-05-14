import React, { createContext, ReactNode, useContext, useState } from 'react';
import mealService from '../services/mealService';
import { Meal } from '../types';

interface MealContextType {
  meals: Meal[] | null;
  isLoading: boolean;
  error: string | null;
  fetchMeals: () => Promise<void>;
  addMeal: (mealData: Meal) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  clearError: () => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const useMeal = () => {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMeal must be used within a MealProvider');
  }
  return context;
};

interface MealProviderProps {
  children: ReactNode;
}

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMeals = await mealService.fetchMeals();
      setMeals(fetchedMeals);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meals');
    } finally {
      setIsLoading(false);
    }
  };

  const addMeal = async (mealData: Meal) => {
    try {
      setIsLoading(true);
      setError(null);
      const newMeal = await mealService.addMeal(mealData);
      setMeals((prevMeals) => (prevMeals ? [...prevMeals, newMeal] : [newMeal]));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add meal');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await mealService.deleteMeal(mealId);
      setMeals((prevMeals) => prevMeals?.filter((meal) => meal.id !== mealId) || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete meal');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <MealContext.Provider
      value={{
        meals,
        isLoading,
        error,
        fetchMeals,
        addMeal,
        deleteMeal,
        clearError,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};