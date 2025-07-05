import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, Eye, UserCheck, UserX, GraduationCap, Building } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext.jsx';

const RegistrarDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDepartmentHeads: 0,
    pendingClearances: 0,
    completedClearances: 0,
    recentClearances: []
  });
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchDashboardStats();
    fetchCollegeClearances();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/registrar/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollegeClearances = async () => {
    try {
      const response = await axios.get('/api/admin/registrar/clearances');
      setClearances(response.data);
    } catch (error) {
      console.error('Error fetching clearances:', error);
    }
  };

  const handleClearanceAction = async (clearanceId, action) => {
    try {
      await axios.post(`/api/admin/registrar/clearance/${clearanceId}/${action}`);
      toast.success(`Clearance ${action}d successfully`);
      fetchCollegeClearances();
      fetchDashboardStats();
    } catch (error) {
      toast.error(`Failed to ${action} clearance`);
    }
  };

  const getCollegeName = () => {
    const collegeMap = {
      'engineering': 'Engineering & Technology',
      'natural_sciences': 'Natural & Computational Sciences',
      'social_sciences': 'Social Sciences & Humanities'
    };
    return collegeMap[user?.college] || user?.college || 'Unknown College';
  };

  const getShortCollegeName = () => {
    const collegeMap = {
      'engineering': 'Engineering & Technology',
      'natural_sciences': 'Natural & Computational Sciences',
      'social_sciences': 'Social Sciences & Humanities'
    };
    return collegeMap[user?.college] || 'Unknown College';
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
        <h1 className="text-2xl font-bold text-gray-900">Registrar Dashboard</h1>
        <p className="text-gray-600">{getShortCollegeName()}</p>
        {!user?.college && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            ⚠️ No college assigned to your account. Please contact system administrator.
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'overview'
                ? 'border-aastu-blue text-aastu-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('clearances')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'clearances'
                ? 'border-aastu-blue text-aastu-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Monitor Clearances
          </button>
        </nav>
      </div>

      {selectedTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-aastu-blue" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        College Students
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalStudents}
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
                    <Building className="h-8 w-8 text-aastu-green" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Department Heads
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalDepartmentHeads}
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
                        Pending Clearances
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pendingClearances}
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
                        Completed Clearances
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.completedClearances}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
                <div className="space-y-3">
                  <a href="/admin/dashboard/college-students" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-aastu-blue mr-3" />
                      <div>
                        <span className="font-medium">Manage Students</span>
                        <p className="text-sm text-gray-500">Add, update, remove students in your college</p>
                      </div>
                    </div>
                  </a>
                  <a href="/admin/dashboard/department-heads" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-aastu-green mr-3" />
                      <div>
                        <span className="font-medium">Manage Department Heads</span>
                        <p className="text-sm text-gray-500">Add, update, remove department heads</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {stats.recentClearances.slice(0, 3).map((clearance) => (
                    <div key={clearance._id} className="flex items-center p-2 border rounded">
                      <div className="flex-shrink-0">
                        {clearance.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {clearance.student?.fullName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {clearance.student?.department}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'clearances' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Clearance Monitoring</h2>
            
            {clearances.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No clearance applications found</p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clearances.map((clearance) => (
                      <tr key={clearance._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {clearance.student?.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {clearance.student?.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {clearance.student?.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                            clearance.status === 'completed' ? 'bg-green-100 text-green-800' :
                            clearance.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {clearance.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(clearance.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {/* View details logic */}}
                              className="text-aastu-blue hover:text-blue-700"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {clearance.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleClearanceAction(clearance._id, 'approve')}
                                  className="text-green-600 hover:text-green-700"
                                  title="Approve"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleClearanceAction(clearance._id, 'reject')}
                                  className="text-red-600 hover:text-red-700"
                                  title="Reject"
                                >
                                  <UserX className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarDashboard;