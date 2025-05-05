import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Clock, AlertTriangle, Truck, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { mockMeals, mockReviews } from '../services/mockData';

interface DietaryInfo {
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  is_spicy: boolean;
  allergens: string[];
  calories: number | null;
}

interface DeliveryInfo {
  radius: number;
  fee: number;
  minimum_order: number;
  estimated_time: string;
  available_times: string[];
}

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  cuisine_type: string[];
  preparation_time: number;
  min_order_quantity: number;
  max_order_quantity: number;
  vendor_id: string;
  dietary_info?: DietaryInfo;
  delivery_info?: DeliveryInfo;
  vendor?: {
    first_name: string;
    last_name: string;
  };
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

// UUID validation regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMeal() {
      try {
        if (!id) {
          setError('Invalid meal ID');
          setLoading(false);
          return;
        }

        // Check if ID matches UUID pattern
        if (UUID_PATTERN.test(id)) {
          // Fetch from Supabase if it's a UUID
          const { data: mealData, error: mealError } = await supabase
            .from('meals')
            .select(`
              *,
              vendor:profiles(
                first_name,
                last_name
              )
            `)
            .eq('id', id)
            .single();

          if (mealError) throw mealError;

          const { data: dietaryData, error: dietaryError } = await supabase
            .from('dietary_info')
            .select('*')
            .eq('meal_id', id)
            .single();

          if (dietaryError && dietaryError.code !== 'PGRST116') throw dietaryError;

          setMeal({ ...mealData, dietary_info: dietaryData || undefined });
          setReviews(mockReviews);
        } else {
          // Use mock data for non-UUID IDs
          const mockMeal = mockMeals.find(m => m.id === id);
          if (!mockMeal) {
            setError('Meal not found');
            setLoading(false);
            return;
          }
          setMeal(mockMeal);
          setReviews(mockReviews);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching meal:', error);
        setError('Failed to load meal details');
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id]);

  const handleAddToCart = () => {
    if (meal) {
      addToCart({
        id: meal.id,
        name: meal.name,
        price: meal.price,
        quantity,
        image: meal.images[0],
        vendor_id: meal.vendor_id
      });
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!meal) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? meal.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === meal.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality with backend
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/meals')}
          className="mt-4 text-orange-600 hover:text-orange-700"
        >
          Return to Meals
        </button>
      </div>
    </div>
  );
  if (!meal) return <div className="text-center py-8">Meal not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={meal.images[currentImageIndex]}
              alt={`${meal.name} - View ${currentImageIndex + 1}`}
              className="w-full h-[500px] object-cover rounded-lg"
            />
            <button
              onClick={() => handleImageNavigation('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Heart className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {meal.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative rounded-lg overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${meal.name} thumbnail ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Meal Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{meal.name}</h1>
            <p className="text-lg text-gray-500">
              By {meal.vendor?.first_name} {meal.vendor?.last_name}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">${meal.price.toFixed(2)}</span>
            <div className="flex items-center">
              <StarRating rating={4.5} showCount count={reviews.length} />
            </div>
          </div>

          <div className="prose prose-orange">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-700">{meal.description}</p>
          </div>

          {/* Dietary Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Dietary Information</h3>
            <div className="grid grid-cols-2 gap-2">
              {meal.dietary_info?.is_vegetarian && (
                <span className="text-green-600 flex items-center">✓ Vegetarian</span>
              )}
              {meal.dietary_info?.is_vegan && (
                <span className="text-green-600 flex items-center">✓ Vegan</span>
              )}
              {meal.dietary_info?.is_gluten_free && (
                <span className="text-green-600 flex items-center">✓ Gluten-free</span>
              )}
              {meal.dietary_info?.is_dairy_free && (
                <span className="text-green-600 flex items-center">✓ Dairy-free</span>
              )}
              {meal.dietary_info?.is_nut_free && (
                <span className="text-green-600 flex items-center">✓ Nut-free</span>
              )}
            </div>
            {meal.dietary_info?.calories && (
              <p className="text-gray-600">Calories: {meal.dietary_info.calories} kcal</p>
            )}
            {meal.dietary_info?.allergens.length > 0 && (
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-700">Contains: </span>
                  <span className="text-gray-600">
                    {meal.dietary_info.allergens.join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Order Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Options</h3>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedDeliveryOption('delivery')}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  selectedDeliveryOption === 'delivery'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <Truck className="h-5 w-5 mb-1 mx-auto" />
                <span className="block text-sm">Delivery</span>
              </button>
              
              <button
                onClick={() => setSelectedDeliveryOption('pickup')}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  selectedDeliveryOption === 'pickup'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <Store className="h-5 w-5 mb-1 mx-auto" />
                <span className="block text-sm">Pickup</span>
              </button>
            </div>

            {selectedDeliveryOption === 'delivery' ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center text-gray-600">
                  <Truck className="h-5 w-5 mr-2" />
                  <span>Delivery fee: $4.99</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Estimated delivery: 30-45 minutes</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Delivery radius: 5 km</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Ready for pickup in: 20-30 minutes</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(meal.min_order_quantity, quantity - 1))}
                  disabled={quantity <= meal.min_order_quantity}
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={meal.max_order_quantity && quantity >= meal.max_order_quantity}
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                fullWidth
                className="flex-1"
              >
                Add to Cart - ${(meal.price * quantity).toFixed(2)}
              </Button>
            </div>

            {meal.min_order_quantity > 1 && (
              <p className="text-sm text-gray-500">
                Minimum order quantity: {meal.min_order_quantity}
              </p>
            )}
            {meal.max_order_quantity && (
              <p className="text-sm text-gray-500">
                Maximum order quantity: {meal.max_order_quantity}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{review.user_name}</h3>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MealDetailPage;