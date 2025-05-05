import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  Eye, 
  Edit2, 
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const VendorOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showOrderDetails, setShowOrderDetails] = useState<string | null>(null);

  useEffect(() => {
    // Simulated API call to fetch orders
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders: Order[] = Array.from({ length: 25 }, (_, i) => ({
          id: `ORD-${(i + 1).toString().padStart(6, '0')}`,
          customerName: `Customer ${i + 1}`,
          orderDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
          totalAmount: Math.round(Math.random() * 200 + 50),
          paymentStatus: ['paid', 'pending', 'failed'][Math.floor(Math.random() * 3)] as Order['paymentStatus'],
          orderStatus: ['processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 4)] as Order['orderStatus'],
          shippingAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'ST',
            zipCode: '12345',
            country: 'USA'
          },
          items: [
            {
              id: `ITEM-${i}-1`,
              name: 'Sample Item 1',
              quantity: Math.floor(Math.random() * 3) + 1,
              price: Math.round(Math.random() * 50 + 10)
            }
          ]
        }));

        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus;
    
    const matchesPayment = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
    
    const matchesDate = (!dateRange.start || new Date(order.orderDate) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(order.orderDate) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleExport = () => {
    const ordersToExport = selectedOrders.length > 0
      ? orders.filter(order => selectedOrders.includes(order.id))
      : orders;

    const csv = [
      ['Order ID', 'Customer Name', 'Order Date', 'Total Amount', 'Payment Status', 'Order Status'],
      ...ordersToExport.map(order => [
        order.id,
        order.customerName,
        new Date(order.orderDate).toLocaleDateString(),
        order.totalAmount.toFixed(2),
        order.paymentStatus,
        order.orderStatus
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['orderStatus']) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'shipped': return <AlertCircle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your customer orders
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
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
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(paginatedOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order.id]);
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                        }
                      }}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="ml-1 capitalize">{order.orderStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      <span className="capitalize">{order.paymentStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowOrderDetails(order.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-blue-400 hover:text-blue-500">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-500">
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
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Show
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="mx-2 border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                entries
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {/* Order details content */}
              <div className="space-y-6">
                {orders.find(order => order.id === showOrderDetails) && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium">Order Information</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-medium">{showOrderDetails}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date(orders.find(order => order.id === showOrderDetails)!.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Customer Information</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {orders.find(order => order.id === showOrderDetails)!.customerName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Shipping Address</h3>
                      <div className="mt-2">
                        <p className="text-sm">
                          {orders.find(order => order.id === showOrderDetails)!.shippingAddress.street}<br />
                          {orders.find(order => order.id === showOrderDetails)!.shippingAddress.city},{' '}
                          {orders.find(order => order.id === showOrderDetails)!.shippingAddress.state}{' '}
                          {orders.find(order => order.id === showOrderDetails)!.shippingAddress.zipCode}<br />
                          {orders.find(order => order.id === showOrderDetails)!.shippingAddress.country}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Order Items</h3>
                      <div className="mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="text-left text-sm font-medium text-gray-500">Item</th>
                              <th className="text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="text-right text-sm font-medium text-gray-500">Price</th>
                              <th className="text-right text-sm font-medium text-gray-500">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.find(order => order.id === showOrderDetails)!.items.map(item => (
                              <tr key={item.id}>
                                <td className="py-2">{item.name}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                                <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3} className="py-2 text-right font-medium">Total:</td>
                              <td className="py-2 text-right font-medium">
                                ${orders.find(order => order.id === showOrderDetails)!.totalAmount.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowOrderDetails(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;