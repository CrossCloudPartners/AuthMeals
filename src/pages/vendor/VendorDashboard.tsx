import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  DollarSign,
  Clock,
  Bell,
  ChevronRight,
  Package,
  Users,
  UtensilsCrossed,
  ClipboardList
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';
import Button from '../../components/common/Button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VendorDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      message: 'New order received for Homemade Lasagna',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'review',
      message: 'New 5-star review from John D.',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Low stock alert: Thai Green Curry',
      time: '1 hour ago'
    }
  ]);

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [150, 230, 180, 290, 200, 320, 270],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const stats = [
    {
      title: 'Today\'s Sales',
      value: '$320.00',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Orders',
      value: '8',
      change: '+3',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Customers',
      value: '156',
      change: '+24',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const topItems = [
    { name: 'Homemade Lasagna', orders: 45, revenue: 720 },
    { name: 'Thai Green Curry', orders: 38, revenue: 532 },
    { name: 'Vegetable Paella', orders: 31, revenue: 465 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/vendor/meals"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="bg-orange-100 p-4 rounded-lg">
              <UtensilsCrossed className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">My Menu</h2>
              <p className="text-gray-500">Manage your meals and offerings</p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-orange-600 transition-colors" />
        </Link>

        <Link
          to="/vendor/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-4 rounded-lg">
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Customer Orders</h2>
              <p className="text-gray-500">View and manage incoming orders</p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTimeframe('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedTimeframe === 'daily'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setSelectedTimeframe('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedTimeframe === 'weekly'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setSelectedTimeframe('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedTimeframe === 'monthly'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <Line data={salesData} options={chartOptions} />
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === 'order' && (
                    <Package className="h-5 w-5 text-blue-500" />
                  )}
                  {notification.type === 'review' && (
                    <Star className="h-5 w-5 text-yellow-500" />
                  )}
                  {notification.type === 'alert' && (
                    <Bell className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/vendor/notifications"
            className="mt-4 flex items-center text-sm text-orange-600 hover:text-orange-700"
          >
            View all notifications
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Top Selling Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Items</h2>
            <Link
              to="/vendor/meals"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link
              to="/vendor/orders"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{order}234</p>
                  <p className="text-xs text-gray-500">2 items • $45.98</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Preparing
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;