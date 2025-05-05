import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteMealProps {
  meal: {
    name: string;
    ingredients: string[];
    instructions: string[];
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const FavoriteMeal: React.FC<FavoriteMealProps> = ({ meal, isFavorite, onToggleFavorite }) => {
  if (!meal?.name || !meal?.ingredients || !meal?.instructions) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Invalid meal data provided</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{meal.name}</h2>
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h3>
          <ul className="list-disc list-inside space-y-1">
            {meal.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            {meal.instructions.map((step, index) => (
              <li key={index} className="text-gray-700">
                <span className="ml-2">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FavoriteMeal;