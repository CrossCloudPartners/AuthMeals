import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Tag, Info, Package } from 'lucide-react';
import StarRating from '../common/StarRating';
import { Meal } from '../../types';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

interface MealCardProps {
  meal: Meal;
  onAddToCart?: (meal: Meal) => void;
  onToggleFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ 
  meal, 
  onAddToCart, 
  onToggleFavorite,
  isFavorite = false 
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(meal);
    } else {
      addToCart(meal, meal.minOrderQuantity || 1);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart icon
    if (!user) {
      toast.error('Please log in to save favorites');
      return;
    }
    if (onToggleFavorite) {
      onToggleFavorite(meal.id);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }
  };

  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={meal.images[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
          alt={meal.name} 
          className="w-full h-full object-cover"
        />
        <button 
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isFavorite 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white text-gray-700 hover:text-red-500 hover:bg-gray-100'
          }`}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {meal.minOrderQuantity > 1 && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
            <Package className="w-4 h-4 mr-1" />
            Min: {meal.minOrderQuantity}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/meals/${meal.id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors">
              {meal.name}
            </h3>
          </Link>
          <span className="font-semibold text-orange-500">${meal.price.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center mb-2">
          <StarRating rating={meal.rating} showCount count={meal.reviewCount} size="sm" />
        </div>

        <p className="text-gray-600 text-sm mb-3">
          {truncateDescription(meal.description)}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {meal.cuisineType.slice(0, 2).map((cuisine, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {cuisine}
            </span>
          ))}
          {meal.dietaryInfo.isVegetarian && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
              <Info className="w-3 h-3 mr-1" />
              Vegetarian
            </span>
          )}
        </div>
        
        {user?.role === 'consumer' && (
          <div>
            {meal.minOrderQuantity > 1 && (
              <p className="text-sm text-gray-500 mb-2">
                Minimum order: {meal.minOrderQuantity} {meal.minOrderQuantity === 1 ? 'item' : 'items'}
              </p>
            )}
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;