import React, { useState, useEffect } from 'react';
import { 
  Users,
  Store,
  DollarSign,
  AlertCircle,
  Bell,
  Activity,
  ChevronDown,
  ChevronUp,
  Settings,
  Shield,
  Database,
  Server,
  RefreshCw
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface SystemMetrics {
  activeUsers: number;
  activeVendors: number;
  dailyOrders: number;
  dailyRevenue: number;
  platformHealth: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: number;
  };
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>(['users', 'revenue']);

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      // In a real app, these would be actual API calls
      const mockMetrics: SystemMetrics = {
        activeUsers: 1250,
        activeVendors: 85,
        dailyOrders: 342,
        dailyRevenue: 8750.50,
        platformHealth: {
          cpu: 45,
          memory: 62,
          storage: 38,
          uptime: 99.98
        }
      };

      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'warning',
          message: 'High server load detected',
          timestamp: new Date().toISOString(),
          resolved: false
        },
        {
          id: '2',
          type: 'error',
          message: 'Payment processing error for Order #12345',
          timestamp: new Date().toISOString(),
          resolved: false
        }
      ];

      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMetricExpansion = (metricId: string) => {
    setExpandedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getHealthStatus = (value: number) => {
    if (value >= 90) return 'bg-red-100 text-red-800';
    if (value >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage platform operations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as '24h' | '7d' | '30d')}
              className="border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button
              variant="outline"
              onClick={fetchDashboardData}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Metrics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-orange-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Active Users</p>
                        <p className="text-2xl font-semibold text-orange-600">
                          {metrics?.activeUsers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">+12%</div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Store className="h-8 w-8 text-green-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Active Vendors</p>
                        <p className="text-2xl font-semibold text-green-600">
                          {metrics?.activeVendors.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">+8%</div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-8 w-8 text-blue-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Daily Orders</p>
                        <p className="text-2xl font-semibold text-blue-600">
                          {metrics?.dailyOrders.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">+15%</div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-purple-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Daily Revenue</p>
                        <p className="text-2xl font-semibold text-purple-600">
                          ${metrics?.dailyRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600">+10%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Health</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                      <span className={`text-sm font-medium ${getHealthStatus(metrics?.platformHealth.cpu || 0)}`}>
                        {metrics?.platformHealth.cpu}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 rounded-full h-2"
                        style={{ width: `${metrics?.platformHealth.cpu}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      <span className={`text-sm font-medium ${getHealthStatus(metrics?.platformHealth.memory || 0)}`}>
                        {metrics?.platformHealth.memory}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: `${metrics?.platformHealth.memory}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                      <span className={`text-sm font-medium ${getHealthStatus(metrics?.platformHealth.storage || 0)}`}>
                        {metrics?.platformHealth.storage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2"
                        style={{ width: `${metrics?.platformHealth.storage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">System Uptime</span>
                      <span className="text-sm font-medium text-green-600">
                        {metrics?.platformHealth.uptime}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 rounded-full h-2"
                        style={{ width: `${metrics?.platformHealth.uptime}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="space-y-8">
          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h2>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg ${
                        alert.type === 'error' ? 'bg-red-50' :
                        alert.type === 'warning' ? 'bg-yellow-50' :
                        'bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(alert.timestamp), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No active alerts
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  className="flex items-center justify-center"
                  onClick={() => {}}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  System Settings
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  className="flex items-center justify-center"
                  onClick={() => {}}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  className="flex items-center justify-center"
                  onClick={() => {}}
                >
                  <Database className="h-5 w-5 mr-2" />
                  Database Management
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  className="flex items-center justify-center"
                  onClick={() => {}}
                >
                  <Server className="h-5 w-5 mr-2" />
                  Server Maintenance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;