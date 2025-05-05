import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import MealCard from '../../components/meals/MealCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Meal } from '../../types';
import toast from 'react-hot-toast';

// UUID validation regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ConsumerFavorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      toast.error('Please log in to view your favorites');
      navigate('/login');
      return;
    }

    if (!UUID_PATTERN.test(user.id)) {
      setLoading(false);
      console.error('Invalid user ID format:', user.id);
      toast.error('Authentication error. Please try logging in again.');
      navigate('/login');
      return;
    }

    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      if (!user?.id || !UUID_PATTERN.test(user.id)) {
        setLoading(false);
        return;
      }

      const { data: favoriteIds, error: favError } = await supabase
        .from('favorites')
        .select('meal_id')
        .eq('user_id', user.id);

      if (favError) throw favError;

      if (!favoriteIds || favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('*, vendor:profiles(first_name, last_name)')
        .in('id', favoriteIds.map(f => f.meal_id));

      if (mealsError) throw mealsError;

      setFavorites(meals || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (mealId: string) => {
    try {
      if (!user?.id) {
        toast.error('Please log in to manage your favorites');
        navigate('/login');
        return;
      }

      if (!UUID_PATTERN.test(user.id)) {
        toast.error('Authentication error. Please try logging in again.');
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('meal_id', mealId);

      if (error) throw error;

      setFavorites(prev => prev.filter(meal => meal.id !== mealId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleAddToCart = (meal: Meal) => {
    addToCart(meal, meal.minOrderQuantity || 1);
    toast.success('Added to cart');
  };

  const filteredFavorites = favorites.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meal.cuisineType.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'date':
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedFavorites = sortedFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedFavorites.length / itemsPerPage);

  const uniqueCategories = Array.from(
    new Set(favorites.flatMap(meal => meal.cuisineType))
  ).sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
              <p className="mt-1 text-sm text-gray-500">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/meals')}
            >
              Browse More Meals
            </Button>
          </div>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'price')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="date">Sort by Date Added</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>

                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedFavorites.map(meal => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    isFavorite={true}
                    onToggleFavorite={() => handleRemoveFavorite(meal.id)}
                    onAddToCart={() => handleAddToCart(meal)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">
                Start exploring our delicious meals and save your favorites for quick access.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/meals')}
              >
                Browse Meals
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerFavorites;