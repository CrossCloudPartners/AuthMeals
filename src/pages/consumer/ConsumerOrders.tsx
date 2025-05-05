import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  MessageCircle,
  Calendar,
  Clock,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// UUID validation pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Order {
  id: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled' | 'rejected';
  total_amount: number;
  delivery_address: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  delivery_option: string;
  delivery_fee: number;
  requested_delivery_time: string;
  special_instructions?: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  created_at: string;
  items: Array<{
    id: string;
    meal_id: string;
    quantity: number;
    price: number;
    total_price: number;
    meal: {
      name: string;
      images: string[];
    };
  }>;
}

const ConsumerOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      toast.error('Please log in to view your orders');
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

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      if (!user?.id || !UUID_PATTERN.test(user.id)) {
        setLoading(false);
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items (
            *,
            meal:meals (
              name,
              images
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );

      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      // In a real app, this would add items to cart and navigate to checkout
      navigate('/checkout');
      toast.success('Items added to cart');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder');
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    // In a real app, this would generate and download a PDF invoice
    toast.success('Invoice downloaded');
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready_for_pickup': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <RefreshCw className="h-4 w-4" />;
      case 'ready_for_pickup': return <Package className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.meal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    const matchesDate = (!dateRange.start || new Date(order.created_at) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(order.created_at) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

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
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your order history
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/meals')}
            >
              Order More
            </Button>
          </div>
        </div>

        {orders.length > 0 ? (
          <>
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>

                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

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

            {/* Orders List */}
            <div className="divide-y divide-gray-200">
              {paginatedOrders.map(order => (
                <div key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace(/_/g, ' ')}</span>
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                          <Clock className="h-4 w-4 ml-4 mr-1" />
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <span className="text-lg font-medium text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedOrders.includes(order.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedOrders.includes(order.id) && (
                    <div className="mt-6 space-y-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Item
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {order.items.map(item => (
                                <tr key={item.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <img
                                        src={item.meal.images[0]}
                                        alt={item.meal.name}
                                        className="h-10 w-10 rounded-lg object-cover"
                                      />
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {item.meal.name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${item.price.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${item.total_price.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Information</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">
                              {order.delivery_address.street}
                              {order.delivery_address.unit && `, ${order.delivery_address.unit}`}<br />
                              {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipCode}<br />
                              {order.delivery_address.country}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                              Delivery Option: {order.delivery_option}<br />
                              Delivery Fee: ${order.delivery_fee.toFixed(2)}
                            </p>
                            {order.special_instructions && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Special Instructions:</p>
                                <p className="text-sm text-gray-500">{order.special_instructions}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Order Actions</h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {order.status === 'out_for_delivery' && (
                              <Button
                                variant="outline"
                                fullWidth
                                className="flex items-center justify-center"
                                onClick={() => window.open('https://tracking.example.com', '_blank')}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Track Delivery
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              fullWidth
                              className="flex items-center justify-center"
                              onClick={() => handleDownloadInvoice(order)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>

                            <Button
                              variant="outline"
                              fullWidth
                              className="flex items-center justify-center"
                              onClick={() => handleReorder(order)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reorder
                            </Button>

                            {order.status === 'pending' && (
                              <Button
                                variant="outline"
                                fullWidth
                                className="flex items-center justify-center text-red-600 hover:text-red-700"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              fullWidth
                              className="flex items-center justify-center"
                              onClick={() => window.open('mailto:support@example.com', '_blank')}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </span>
                  </div>
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
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h2>
              <p className="mt-1 text-sm text-gray-500">
                Start exploring our delicious meals and place your first order.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => navigate('/meals')}
                >
                  Browse Meals
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerOrders;