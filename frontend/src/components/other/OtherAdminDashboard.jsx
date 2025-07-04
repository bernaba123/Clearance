import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';

const OtherAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    recentApplications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/other-admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'chief_librarian': 'Chief Librarian',
      'dormitory_proctor': 'Dormitory Proctor',
      'dining_officer': 'Dining Officer',
      'student_affairs': 'Student Affairs/Service Dean',
      'student_discipline': 'Student Discipline',
      'cost_sharing': 'Cost Sharing Officer'
    };
    return roleMap[role] || role.replace('_', ' ');
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {getRoleDisplayName(user?.role)} - Manage clearance requirements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-aastu-blue" />
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
                    Pending Review
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
                <CheckCircle className="h-8 w-8 text-aastu-green" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.approvedApplications}
                  </dd>
                </dl>
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
                    <tr key={application._id} className="hover:bg-gray-50">
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
                          application.myStatus === 'approved' ? 'bg-green-100 text-green-800' :
                          application.myStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.myStatus || 'pending'}
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

      {/* Role-specific Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Responsibilities</h3>
          
          <div className="space-y-3">
            {user?.role === 'chief_librarian' && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Library Clearance</h4>
                <p className="text-sm text-blue-700">
                  Review and approve library clearances. Ensure all books are returned and fines are paid.
                </p>
              </div>
            )}
            
            {user?.role === 'dormitory_proctor' && (
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Dormitory Clearance</h4>
                <p className="text-sm text-green-700">
                  Verify dormitory clearances. Check room conditions and settle any damages.
                </p>
              </div>
            )}
            
            {user?.role === 'dining_officer' && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900">Dining Services Clearance</h4>
                <p className="text-sm text-yellow-700">
                  Process dining service clearances. Verify meal plan settlements and equipment returns.
                </p>
              </div>
            )}
            
            {user?.role === 'student_affairs' && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Student Affairs Clearance</h4>
                <p className="text-sm text-purple-700">
                  Handle student affairs clearances. Review student records and resolve any pending issues.
                </p>
              </div>
            )}
            
            {user?.role === 'student_discipline' && (
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900">Disciplinary Clearance</h4>
                <p className="text-sm text-red-700">
                  Review disciplinary records. Ensure all disciplinary actions are resolved.
                </p>
              </div>
            )}
            
            {user?.role === 'cost_sharing' && (
              <div className="p-3 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900">Cost Sharing Clearance</h4>
                <p className="text-sm text-indigo-700">
                  Process cost sharing clearances. Verify payment settlements and financial obligations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/dashboard/profile" 
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <User className="h-6 w-6 text-aastu-blue mr-3" />
                <div>
                  <h4 className="font-medium">Manage Profile</h4>
                  <p className="text-sm text-gray-600">Update your profile information</p>
                </div>
              </div>
            </a>
            
            <div className="block p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-aastu-green mr-3" />
                <div>
                  <h4 className="font-medium">System Status</h4>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherAdminDashboard;