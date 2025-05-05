import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import { mockMeals } from '../../services/mockData';

const VendorMeals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'published'>('all');

  const meals = mockMeals.slice(0, 5); // Using mock data for now

  const handleStatusChange = (mealId: string, newStatus: string) => {
    // Implement status change logic
    console.log('Status changed:', mealId, newStatus);
  };

  const handleDelete = (mealId: string) => {
    // Implement delete logic
    console.log('Delete meal:', mealId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Meals</h1>
        <Link to="/vendor/meals/create">
          <Button variant="primary" className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Meal
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className={`h-5 w-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Meals Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meals.map((meal) => (
                <tr key={meal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={meal.images[0]}
                        alt={meal.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{meal.name}</div>
                        <div className="text-sm text-gray-500">ID: {meal.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${meal.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value="published"
                      onChange={(e) => handleStatusChange(meal.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(meal.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/meals/${meal.id}`}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/vendor/meals/${meal.id}/edit`}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 5 of 12 meals
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMeals;