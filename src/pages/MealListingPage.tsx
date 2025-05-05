import React, { useState, useEffect } from 'react';
import { MapPin, SlidersHorizontal, X } from 'lucide-react';
import MealCard from '../components/meals/MealCard';
import FilterSidebar from '../components/meals/FilterSidebar';
import { Meal } from '../types';
import { mockMeals } from '../services/mockData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const MealListingPage: React.FC = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>({
    priceRange: [0, 100],
    cuisineFilters: [],
    dietaryFilters: [],
    distance: 10,
  });

  useEffect(() => {
    // Simulate API call to get meals
    setLoading(true);
    setTimeout(() => {
      setMeals(mockMeals);
      setFilteredMeals(mockMeals);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Fetch user's favorites when component mounts
    const fetchFavorites = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('meal_id')
            .eq('user_id', user.id);

          if (error) throw error;
          setFavorites(data.map(fav => fav.meal_id));
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (mealId: string) => {
    if (!user) return;

    try {
      const isFavorite = favorites.includes(mealId);
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('meal_id', mealId);

        if (error) throw error;
        setFavorites(favorites.filter(id => id !== mealId));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, meal_id: mealId }]);

        if (error) throw error;
        setFavorites([...favorites, mealId]);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  useEffect(() => {
    // Apply filtering logic when active filters change
    if (meals.length > 0) {
      let results = [...meals];
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(meal => 
          meal.name.toLowerCase().includes(query) || 
          meal.description.toLowerCase().includes(query) ||
          meal.cuisineType.some(cuisine => cuisine.toLowerCase().includes(query))
        );
      }
      
      // Apply price filter
      results = results.filter(meal => 
        meal.price >= activeFilters.priceRange[0] && 
        meal.price <= activeFilters.priceRange[1]
      );
      
      // Apply cuisine filters
      if (activeFilters.cuisineFilters.length > 0) {
        results = results.filter(meal => 
          meal.cuisineType.some(cuisine => 
            activeFilters.cuisineFilters.includes(cuisine)
          )
        );
      }
      
      // Apply dietary filters
      if (activeFilters.dietaryFilters.length > 0) {
        results = results.filter(meal => {
          return activeFilters.dietaryFilters.every((filter: string) => {
            switch (filter.toLowerCase()) {
              case 'vegetarian':
                return meal.dietaryInfo.isVegetarian;
              case 'vegan':
                return meal.dietaryInfo.isVegan;
              case 'gluten-free':
                return meal.dietaryInfo.isGlutenFree;
              case 'dairy-free':
                return meal.dietaryInfo.isDairyFree;
              case 'nut-free':
                return meal.dietaryInfo.isNutFree;
              default:
                return true;
            }
          });
        });
      }
      
      // Apply distance filter (in a real app, this would use geolocation)
      if (activeFilters.distance) {
        // Simulating distance filtering
        results = results.filter(meal => 
          meal.deliveryInfo?.radius <= activeFilters.distance
        );
      }
      
      setFilteredMeals(results);
    }
  }, [meals, searchQuery, activeFilters]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleRemoveCuisineFilter = (cuisine: string) => {
    setActiveFilters({
      ...activeFilters,
      cuisineFilters: activeFilters.cuisineFilters.filter((c: string) => c !== cuisine)
    });
  };

  const handleRemoveDietaryFilter = (dietary: string) => {
    setActiveFilters({
      ...activeFilters,
      dietaryFilters: activeFilters.dietaryFilters.filter((d: string) => d !== dietary)
    });
  };

  const resetFilters = () => {
    setActiveFilters({
      priceRange: [0, 100],
      cuisineFilters: [],
      dietaryFilters: [],
      distance: 10,
    });
    setSearchQuery('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Search Header */}
      <div className="bg-orange-500 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search meals, cuisines, or dietary preferences..."
                  className="w-full py-3 px-4 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-3.5">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <button
              onClick={toggleFilters}
              className="md:hidden bg-white text-orange-500 py-2 px-4 rounded-md font-medium flex items-center"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(activeFilters.cuisineFilters.length > 0 || activeFilters.dietaryFilters.length > 0) && (
        <div className="bg-white py-3 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {activeFilters.cuisineFilters.map((cuisine: string) => (
                <span 
                  key={cuisine} 
                  className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full flex items-center"
                >
                  {cuisine}
                  <button 
                    onClick={() => handleRemoveCuisineFilter(cuisine)}
                    className="ml-1.5 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {activeFilters.dietaryFilters.map((dietary: string) => (
                <span 
                  key={dietary} 
                  className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center"
                >
                  {dietary}
                  <button 
                    onClick={() => handleRemoveDietaryFilter(dietary)}
                    className="ml-1.5 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              <button 
                onClick={resetFilters}
                className="text-sm text-orange-500 hover:text-orange-600 ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
              <div className="h-full w-4/5 max-w-xs bg-white p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={toggleFilters} className="text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </div>
          )}
          
          {/* Meal Grid */}
          <div className="flex-grow md:ml-8 mt-6 md:mt-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Browse Meals</h1>
              <p className="text-gray-600">{filteredMeals.length} results</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : filteredMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map(meal => (
                  <MealCard 
                    key={meal.id} 
                    meal={meal}
                    isFavorite={favorites.includes(meal.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No meals found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={resetFilters}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealListingPage;