import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Eye, UserCheck, UserX, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext.jsx';

const OtherAdminDashboard = () => {
  const { user, getRoleDisplayName } = useAuth();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalProcessed: 0
  });
  const [clearanceRequests, setClearanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    fetchClearanceRequests();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/other-admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClearanceRequests = async () => {
    try {
      const response = await axios.get('/api/other-admin/clearance-requests');
      setClearanceRequests(response.data);
    } catch (error) {
      console.error('Error fetching clearance requests:', error);
    }
  };

  const handleClearanceAction = async (requestId, action, remarks = '') => {
    try {
      await axios.post(`/api/other-admin/clearance/${requestId}/${action}`, { remarks });
      toast.success(`Clearance ${action}d successfully`);
      fetchClearanceRequests();
      fetchDashboardStats();
      setSelectedRequest(null);
    } catch (error) {
      toast.error(`Failed to ${action} clearance`);
    }
  };

  const getOfficeType = () => {
    const officeMap = {
      'chief_librarian': 'Library',
      'dormitory_proctor': 'Dormitory',
      'dining_officer': 'Dining Services',
      'student_affairs': 'Student Affairs',
      'student_discipline': 'Student Discipline',
      'cost_sharing': 'Cost Sharing Office'
    };
    return officeMap[user?.role] || 'Office';
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
        <h1 className="text-2xl font-bold text-gray-900">{getRoleDisplayName(user?.role)} Dashboard</h1>
        <p className="text-gray-600">{getOfficeType()} - Clearance Management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-aastu-gold" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Approvals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendingApprovals}
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
                    Approved Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.approvedToday}
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
                <UserX className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejected Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.rejectedToday}
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
                <FileText className="h-8 w-8 text-aastu-blue" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Processed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalProcessed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Notice */}
      {stats.pendingApprovals > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have <strong>{stats.pendingApprovals}</strong> pending clearance request{stats.pendingApprovals > 1 ? 's' : ''} that require your approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clearance Requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Clearance Requests</h2>
          
          {clearanceRequests.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No pending clearance requests</p>
            </div>
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
                      Reason
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
                  {clearanceRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.student?.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.student?.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.student?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.reason || 'Graduation Clearance'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          request.officeStatus?.[user?.role] === 'approved' ? 'bg-green-100 text-green-800' :
                          request.officeStatus?.[user?.role] === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.officeStatus?.[user?.role] || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-aastu-blue hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {(!request.officeStatus?.[user?.role] || request.officeStatus[user?.role] === 'pending') && (
                            <>
                              <button
                                onClick={() => handleClearanceAction(request._id, 'approve')}
                                className="text-green-600 hover:text-green-700"
                                title="Approve"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleClearanceAction(request._id, 'reject')}
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

      {/* Quick Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Responsibilities</h3>
          <div className="prose text-sm text-gray-600">
            <p>As a <strong>{getRoleDisplayName(user?.role)}</strong>, you are responsible for:</p>
            <ul className="mt-2 space-y-1">
              <li>• Reviewing student clearance requests promptly</li>
              <li>• Approving requests when all requirements are met</li>
              <li>• Rejecting requests with clear reasons when requirements are not fulfilled</li>
              <li>• Maintaining accurate records of all decisions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Clearance Request Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">{selectedRequest.student?.fullName}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.student?.studentId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedRequest.student?.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{selectedRequest.reason || 'Graduation Clearance'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedRequest.officeStatus?.[user?.role] === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedRequest.officeStatus?.[user?.role] === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRequest.officeStatus?.[user?.role] || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                {(!selectedRequest.officeStatus?.[user?.role] || selectedRequest.officeStatus[user?.role] === 'pending') && (
                  <>
                    <button
                      onClick={() => handleClearanceAction(selectedRequest._id, 'approve')}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleClearanceAction(selectedRequest._id, 'reject')}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherAdminDashboard;