import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Settings, 
  Shield, 
  Download,
  ChevronRight,
  Clock,
  DollarSign,
  ShoppingBag,
  MessageSquare,
  Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import AddressInput from '../../components/common/AddressInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// UUID validation pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  frequentItems: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

interface Communication {
  id: string;
  type: 'email' | 'chat' | 'support';
  subject: string;
  date: string;
  status: 'open' | 'closed';
}

const ConsumerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'preferences' | 'security'>('overview');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    preferredContact: 'email',
    marketingOptIn: true,
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Validate user ID format
    if (!user.id || !UUID_PATTERN.test(user.id)) {
      console.error('Invalid user ID format');
      toast.error('Invalid user ID. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchCustomerData = async () => {
      try {
        // First, check if profile exists and create if it doesn't
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileCheckError) throw profileCheckError;

        if (!existingProfile) {
          // Create new profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              first_name: user.firstName || '',
              last_name: user.lastName || '',
              role: 'consumer',
              email: user.email
            }])
            .select()
            .single();

          if (createError) throw createError;

          if (newProfile) {
            setFormData(prev => ({
              ...prev,
              firstName: newProfile.first_name || '',
              lastName: newProfile.last_name || '',
              email: newProfile.email || user.email || '',
              phone: newProfile.phone || '',
            }));
          }
        } else {
          // Use existing profile data
          setFormData(prev => ({
            ...prev,
            firstName: existingProfile.first_name || '',
            lastName: existingProfile.last_name || '',
            email: existingProfile.email || user.email || '',
            phone: existingProfile.phone || '',
            preferredContact: existingProfile.preferred_contact || 'email',
            marketingOptIn: existingProfile.marketing_opt_in || true,
            notifications: existingProfile.notifications || prev.notifications
          }));
          setProfileImage(existingProfile.avatar_url);
        }

        // Fetch orders data
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id);

        if (ordersError) throw ordersError;

        // Calculate stats
        const totalOrders = ordersData?.length || 0;
        const totalSpent = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
        const lastOrderDate = ordersData?.[0]?.created_at || '';

        setStats({
          totalOrders,
          totalSpent,
          averageOrderValue,
          lastOrderDate,
          frequentItems: [] // This would be calculated from order items
        });

        // Fetch communications
        const { data: commsData, error: commsError } = await supabase
          .from('communications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (commsError) throw commsError;
        setCommunications(commsData || []);

      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setProfileImage(publicUrl);
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          preferred_contact: formData.preferredContact,
          marketing_opt_in: formData.marketingOptIn,
          notifications: formData.notifications
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleExportData = async () => {
    try {
      // Fetch all user data
      const userData = {
        profile: formData,
        orders: stats,
        communications
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

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
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full cursor-pointer hover:bg-orange-600">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
              </label>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-500">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Customer ID: {user?.id}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'preferences', label: 'Preferences', icon: Settings },
              { id: 'security', label: 'Security', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <tab.icon className="h-5 w-5 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingBag className="h-8 w-8 text-orange-500" />
                    <span className="text-sm text-gray-500">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <span className="text-sm text-gray-500">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold">${stats?.totalSpent.toFixed(2) || '0.00'}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <span className="text-sm text-gray-500">Avg. Order Value</span>
                  </div>
                  <p className="text-2xl font-bold">${stats?.averageOrderValue.toFixed(2) || '0.00'}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <span className="text-sm text-gray-500">Last Order</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats?.lastOrderDate
                      ? new Date(stats.lastOrderDate).toLocaleDateString()
                      : 'No orders yet'}
                  </p>
                </div>
              </div>

              {/* Recent Communications */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Communications</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {communications.length > 0 ? (
                    communications.map(comm => (
                      <div key={comm.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {comm.type === 'email' && <Mail className="h-5 w-5 text-gray-400" />}
                            {comm.type === 'chat' && <MessageSquare className="h-5 w-5 text-gray-400" />}
                            {comm.type === 'support' && <Bell className="h-5 w-5 text-gray-400" />}
                            <span className="ml-3 text-sm font-medium text-gray-900">{comm.subject}</span>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              comm.status === 'open'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {comm.status}
                            </span>
                            <span className="ml-4 text-sm text-gray-500">
                              {new Date(comm.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-gray-500">
                      No recent communications
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Order History</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/consumer/orders')}
                >
                  View All Orders
                </Button>
              </div>

              {stats?.frequentItems && stats.frequentItems.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Times Ordered
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.frequentItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.count} times
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/meals/${item.id}`)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Order Again
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start exploring our delicious meals to place your first order.
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
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Order Updates</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications about your order status
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.orderUpdates}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            orderUpdates: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Promotions</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications about special offers and discounts
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.promotions}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            promotions: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                      <p className="text-sm text-gray-500">
                        Receive our weekly newsletter with new meals and cooking tips
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.newsletter}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            newsletter: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Marketing Preferences */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Marketing Preferences</h2>
                </div>
                <div className="p-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.marketingOptIn}
                      onChange={(e) => setFormData({ ...formData, marketingOptIn: e.target.checked })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to receive marketing communications about products, services, and promotions
                    </span>
                  </label>
                </div>
              </div>

              {/* Save Changes */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setFormData({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    phone: '',
                    preferredContact: 'email',
                    marketingOptIn: true,
                    notifications: {
                      orderUpdates: true,
                      promotions: true,
                      newsletter: false,
                    }
                  })}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Privacy & Data</h2>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">
                    Your privacy is important to us. You can export your data or manage your privacy settings below.
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="flex items-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Export My Data
                  </Button>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Data Usage</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Your data is encrypted and securely stored</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">We never share your personal information with third parties</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">You can request data deletion at any time</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Account Security</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">
                      Set Up 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Password</h3>
                      <p className="text-sm text-gray-500">
                        Last changed 3 months ago
                      </p>
                    </div>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Login History</h3>
                      <p className="text-sm text-gray-500">
                        View your recent login activity
                      </p>
                    </div>
                    <Button variant="outline">
                      View History
                    </Button>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-red-600">Delete Account</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfile;