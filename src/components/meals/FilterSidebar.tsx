import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../common/Button';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [distance, setDistance] = useState<number>(10);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    cuisine: true,
    dietary: true,
    distance: true,
  });

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 
    'Japanese', 'Thai', 'American', 'Mediterranean',
    'French', 'Korean', 'Vietnamese'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 
    'Dairy-Free', 'Nut-Free', 'Low-Carb', 'Keto'
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleCuisineChange = (cuisine: string) => {
    if (cuisineFilters.includes(cuisine)) {
      setCuisineFilters(cuisineFilters.filter(item => item !== cuisine));
    } else {
      setCuisineFilters([...cuisineFilters, cuisine]);
    }
  };

  const handleDietaryChange = (dietary: string) => {
    if (dietaryFilters.includes(dietary)) {
      setDietaryFilters(dietaryFilters.filter(item => item !== dietary));
    } else {
      setDietaryFilters([...dietaryFilters, dietary]);
    }
  };

  const handlePriceMinChange = (value: number) => {
    setPriceRange([value, priceRange[1]]);
  };

  const handlePriceMaxChange = (value: number) => {
    setPriceRange([priceRange[0], value]);
  };

  const handleDistanceChange = (value: number) => {
    setDistance(value);
  };

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      cuisineFilters,
      dietaryFilters,
      distance,
    });
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setCuisineFilters([]);
    setDietaryFilters([]);
    setDistance(10);
    onFilterChange({
      priceRange: [0, 100],
      cuisineFilters: [],
      dietaryFilters: [],
      distance: 10,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-sm text-orange-500 hover:text-orange-600"
        >
          Reset All
        </button>
      </div>

      <Button
        onClick={applyFilters}
        variant="primary"
        fullWidth
        className="mb-6"
      >
        Apply Filters
      </Button>

      {/* Price Range Filter */}
      <div className="mb-4 border-b pb-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          onClick={() => toggleSection('price')}
        >
          <span>Price Range</span>
          {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expandedSections.price && (
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">${priceRange[0]}</span>
              <span className="text-sm text-gray-500">${priceRange[1]}</span>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceMinChange(parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  id="max-price"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceMaxChange(parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Distance Filter */}
      <div className="mb-4 border-b pb-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          onClick={() => toggleSection('distance')}
        >
          <span>Distance</span>
          {expandedSections.distance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expandedSections.distance && (
          <div className="mt-2">
            <span className="block text-sm text-gray-500 mb-1">Within {distance} km</span>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={distance}
              onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1km</span>
              <span>25km</span>
              <span>50km</span>
            </div>
          </div>
        )}
      </div>

      {/* Cuisine Type Filter */}
      <div className="mb-4 border-b pb-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          onClick={() => toggleSection('cuisine')}
        >
          <span>Cuisine Type</span>
          {expandedSections.cuisine ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expandedSections.cuisine && (
          <div className="mt-2 space-y-2">
            {cuisineOptions.map((cuisine) => (
              <div key={cuisine} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cuisine-${cuisine}`}
                  checked={cuisineFilters.includes(cuisine)}
                  onChange={() => handleCuisineChange(cuisine)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 rounded"
                />
                <label htmlFor={`cuisine-${cuisine}`} className="ml-2 text-sm text-gray-700">
                  {cuisine}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dietary Restrictions Filter */}
      <div className="mb-4 border-b pb-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          onClick={() => toggleSection('dietary')}
        >
          <span>Dietary Restrictions</span>
          {expandedSections.dietary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {expandedSections.dietary && (
          <div className="mt-2 space-y-2">
            {dietaryOptions.map((dietary) => (
              <div key={dietary} className="flex items-center">
                <input
                  type="checkbox"
                  id={`dietary-${dietary}`}
                  checked={dietaryFilters.includes(dietary)}
                  onChange={() => handleDietaryChange(dietary)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 rounded"
                />
                <label htmlFor={`dietary-${dietary}`} className="ml-2 text-sm text-gray-700">
                  {dietary}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={applyFilters}
        variant="primary"
        fullWidth
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;