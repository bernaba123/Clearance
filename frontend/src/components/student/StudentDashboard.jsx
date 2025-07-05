import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Download, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [clearanceStatus, setClearanceStatus] = useState(null);
  const [systemStatus, setSystemStatus] = useState({ clearanceSystemActive: true, registrationActive: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch system status first
      const systemResponse = await axios.get('/api/admin/public/system-status');
      setSystemStatus(systemResponse.data);

      // Only fetch clearance status if system is active
      if (systemResponse.data.clearanceSystemActive) {
        try {
          const clearanceResponse = await axios.get('/api/clearance/status');
          setClearanceStatus(clearanceResponse.data);
        } catch (error) {
          // If no clearance found, that's okay - student hasn't applied yet
          if (error.response?.status === 404) {
            setClearanceStatus(null);
          } else if (error.response?.status === 503 && error.response?.data?.systemDeactivated) {
            // System is deactivated - this is handled by the system status check above
            setClearanceStatus(null);
          } else {
            console.error('Error fetching clearance status:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return AlertCircle;
      case 'pending': return Clock;
      default: return Clock;
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
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-gray-600">
            Student ID: {user?.studentId} | Department: {user?.department}
          </p>
        </div>
      </div>

      {/* System Status Alert */}
      {!systemStatus.clearanceSystemActive && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>System Notice:</strong> The clearance system is currently deactivated. 
                Please contact the administration for more information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systemStatus.clearanceSystemActive ? (
          <Link
            to="/student/dashboard/apply"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-aastu-blue" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Apply for Clearance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Start Application
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 overflow-hidden shadow rounded-lg opacity-50 cursor-not-allowed">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Apply for Clearance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      System Disabled
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {systemStatus.clearanceSystemActive ? (
          <Link
            to="/student/dashboard/status"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-aastu-green" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      View Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Track Progress
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 overflow-hidden shadow rounded-lg opacity-50 cursor-not-allowed">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      View Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      System Disabled
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`overflow-hidden shadow rounded-lg ${systemStatus.clearanceSystemActive ? 'bg-white' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Download className={`h-8 w-8 ${systemStatus.clearanceSystemActive ? 'text-aastu-gold' : 'text-gray-400'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Download Certificate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {!systemStatus.clearanceSystemActive ? 'System Disabled' : 
                     clearanceStatus?.status === 'completed' ? 'Available' : 'Not Ready'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Application Status */}
      {systemStatus.clearanceSystemActive && clearanceStatus && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Current Application Status</h2>
            
            <div className="space-y-4">
              {clearanceStatus.approvals?.map((approval) => {
                const StatusIcon = getStatusIcon(approval.status);
                return (
                  <div key={approval.adminType} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <StatusIcon className={`h-5 w-5 mr-3 ${getStatusColor(approval.status).split(' ')[0]}`} />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {approval.adminType.replace('_', ' ')}
                        </p>
                        {approval.reason && (
                          <p className="text-sm text-gray-600">{approval.reason}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(approval.status)}`}>
                      {approval.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {clearanceStatus.status === 'completed' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">
                    Congratulations! Your clearance has been approved.
                  </p>
                </div>
                <button className="mt-2 btn-success">
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Application submitted</span>
              <span className="ml-auto text-gray-500">2 days ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Library clearance approved</span>
              <span className="ml-auto text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Pending department head approval</span>
              <span className="ml-auto text-gray-500">Now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;