import { ReactNode } from 'react';

interface Meal {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export function displayFavoriteMeal(meal: Meal): ReactNode | null {
  try {
    // Validate meal data
    if (!meal?.name || !Array.isArray(meal?.ingredients) || !Array.isArray(meal?.instructions)) {
      throw new Error('Invalid meal data structure');
    }

    if (meal.ingredients.length === 0 || meal.instructions.length === 0) {
      throw new Error('Meal must have both ingredients and instructions');
    }

    // Return the FavoriteMeal component
    return {
      type: 'FavoriteMeal',
      props: {
        meal,
        isFavorite: true,
        onToggleFavorite: () => {},
      },
    };
  } catch (error) {
    console.error('Error displaying favorite meal:', error);
    return null;
  }
}