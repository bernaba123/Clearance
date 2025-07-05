import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, TrendingUp, Power, UserPlus, Settings } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SystemAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    recentApplications: []
  });
  const [systemStatus, setSystemStatus] = useState({
    clearanceSystemActive: true,
    registrationActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchSystemStatus();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await axios.get('/api/admin/system-status');
      setSystemStatus(response.data);
    } catch (error) {
      console.error('Error fetching system status:', error);
    }
  };

  const toggleSystemStatus = async (type) => {
    try {
      const response = await axios.post('/api/admin/toggle-system', { type });
      setSystemStatus(response.data);
      const statusKey = type === 'clearance' ? 'clearanceSystemActive' : 'registrationActive';
      const systemName = type === 'clearance' ? 'Clearance system' : 'Registration';
      const statusText = response.data[statusKey] ? 'activated' : 'deactivated';
      toast.success(`${systemName} ${statusText} successfully`);
    } catch (error) {
      console.error('Toggle system status error:', error);
      toast.error('Failed to update system status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aastu-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Admin Dashboard</h1>
        <p className="text-gray-600">Complete system control and oversight</p>
      </div>

      {/* System Controls */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Power className="h-5 w-5 text-aastu-blue mr-3" />
                <div>
                  <h3 className="font-medium">Clearance System</h3>
                  <p className="text-sm text-gray-500">Enable/disable student clearance applications</p>
                </div>
              </div>
              <button
                onClick={() => toggleSystemStatus('clearance')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-aastu-blue focus:ring-offset-2 ${
                  systemStatus.clearanceSystemActive ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    systemStatus.clearanceSystemActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 text-aastu-blue mr-3" />
                <div>
                  <h3 className="font-medium">Registration System</h3>
                  <p className="text-sm text-gray-500">Enable/disable new user registrations</p>
                </div>
              </div>
              <button
                onClick={() => toggleSystemStatus('registration')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-aastu-blue focus:ring-offset-2 ${
                  systemStatus.registrationActive ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    systemStatus.registrationActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-aastu-blue" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-aastu-green" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Applications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalApplications}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-aastu-gold" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Applications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendingApplications}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Applications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.completedApplications}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Management</h3>
            <div className="space-y-3">
              <a href="/admin/dashboard/system-users" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-aastu-blue mr-3" />
                  <div>
                    <span className="font-medium">Manage Registrars & Admins</span>
                    <p className="text-sm text-gray-500">Add, update, remove registrars and other administrators</p>
                  </div>
                </div>
              </a>
              <a href="/admin/dashboard/news" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-aastu-green mr-3" />
                  <div>
                    <span className="font-medium">Manage News</span>
                    <p className="text-sm text-gray-500">Create and manage news and announcements</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clearance System</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  systemStatus.clearanceSystemActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemStatus.clearanceSystemActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Registration</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  systemStatus.registrationActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemStatus.registrationActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h2>
          
          {stats.recentApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent applications</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentApplications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.student?.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.student?.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.student?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          application.status === 'completed' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;