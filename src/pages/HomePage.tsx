import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Star, Clock, Award } from 'lucide-react';
import MealCard from '../components/meals/MealCard';
import { Meal } from '../types';
import { mockMeals } from '../services/mockData';

const HomePage: React.FC = () => {
  const [location, setLocation] = useState('');
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [topRatedVendors, setTopRatedVendors] = useState<any[]>([]);

  useEffect(() => {
    // Fetch featured meals
    setFeaturedMeals(mockMeals.slice(0, 8));

    // Mock top rated vendors
    setTopRatedVendors([
      {
        id: '1',
        name: 'Maria\'s Kitchen',
        image: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        rating: 4.9,
        reviewCount: 128,
        cuisine: 'Italian'
      },
      {
        id: '2',
        name: 'Thai Delights',
        image: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        rating: 4.7,
        reviewCount: 87,
        cuisine: 'Thai'
      },
      {
        id: '3',
        name: 'Homestyle Mexican',
        image: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        rating: 4.8,
        reviewCount: 104,
        cuisine: 'Mexican'
      }
    ]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, redirect to search results with location parameter
    console.log('Searching in:', location);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Discover Amazing Homemade Meals In Your Neighborhood
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with talented home cooks near you and enjoy authentic, fresh meals delivered to your door.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex bg-white rounded-full overflow-hidden shadow-lg">
            <div className="flex-grow flex items-center px-4">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full py-3 px-2 focus:outline-none text-gray-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              <span>Find Meals</span>
            </button>
          </form>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How AuthMeals Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Local Cooks</h3>
              <p className="text-gray-600">
                Discover talented home cooks in your neighborhood offering delicious, homemade meals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Order Ahead</h3>
              <p className="text-gray-600">
                Browse menus, read reviews, and place your order for pickup or delivery on your schedule.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enjoy Quality Meals</h3>
              <p className="text-gray-600">
                Savor fresh, authentic food made with love and support local culinary entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Meals Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Meals</h2>
            <Link to="/meals" className="text-orange-500 hover:text-orange-600 flex items-center">
              View all <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMeals.slice(0, 8).map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Top-Rated Vendors */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Top-Rated Home Cooks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topRatedVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{vendor.name}</h3>
                  <div className="flex items-center mb-3">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-gray-700">{vendor.rating}</span>
                    <span className="mx-1 text-gray-500">•</span>
                    <span className="text-gray-500">{vendor.reviewCount} reviews</span>
                  </div>
                  <p className="text-gray-600 mb-4">Specializes in {vendor.cuisine} cuisine</p>
                  <Link 
                    to={`/vendor/${vendor.id}`} 
                    className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
                  >
                    View Profile <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Become a Vendor CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Are You a Talented Home Cook?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of culinary entrepreneurs and share your passion for food with hungry customers in your area.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-600 hover:bg-gray-100 py-3 px-8 rounded-full font-semibold text-lg inline-block"
          >
            Become a Vendor
          </Link>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Community Says</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've discovered so many amazing home cooks in my neighborhood! The food is always fresh, tasty, and has that homemade quality you can't get from restaurants."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone with specific dietary needs, I love that I can find home cooks who accommodate my restrictions without sacrificing flavor. AuthMeals has been a game-changer!"
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Maria Garcia</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I started selling my family recipes on AuthMeals six months ago, and I'm thrilled with the response. I've built a loyal customer base and can finally share my passion for cooking with others!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;