import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState({ status: '', reason: '' });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/department/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (applicationId, status, reason = '') => {
    try {
      await axios.post(`/api/department/applications/${applicationId}/review`, {
        status,
        reason
      });
      
      toast.success(`Application ${status} successfully`);
      fetchApplications();
      setShowModal(false);
      setSelectedApplication(null);
      setReviewData({ status: '', reason: '' });
    } catch (error) {
      toast.error('Failed to review application');
    }
  };

  const openReviewModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student?.studentId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.departmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Review Applications</h1>
        <p className="text-gray-600">Review and approve/reject student clearance applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
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
                    {application.student?.yearLevel}
                    {application.student?.yearLevel === 1 ? 'st' : 
                     application.student?.yearLevel === 2 ? 'nd' : 
                     application.student?.yearLevel === 3 ? 'rd' : 'th'} Year
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      application.isEarlyApplication 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {application.isEarlyApplication ? 'Early' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(application.departmentStatus)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(application.departmentStatus)}`}>
                        {application.departmentStatus || 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openReviewModal(application)}
                        className="text-aastu-blue hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(!application.departmentStatus || application.departmentStatus === 'pending') && (
                        <>
                          <button
                            onClick={() => handleReview(application._id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openReviewModal(application)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
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
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review Application - {selectedApplication.student?.fullName}
              </h3>
              
              <div className="space-y-4">
                {/* Student Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Student Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedApplication.student?.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ID:</span>
                      <span className="ml-2 font-medium">{selectedApplication.student?.studentId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 font-medium">{selectedApplication.student?.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Year:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.student?.yearLevel}
                        {selectedApplication.student?.yearLevel === 1 ? 'st' : 
                         selectedApplication.student?.yearLevel === 2 ? 'nd' : 
                         selectedApplication.student?.yearLevel === 3 ? 'rd' : 'th'} Year
                      </span>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h4 className="font-medium mb-2">Application Details</h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2">
                        {selectedApplication.isEarlyApplication ? 'Early Clearance' : 'Regular Clearance'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Applied:</span>
                      <span className="ml-2">{new Date(selectedApplication.createdAt).toLocaleDateString()}</span>
                    </div>
                    {selectedApplication.isEarlyApplication && selectedApplication.earlyReason && (
                      <div>
                        <span className="text-gray-600">Early Reason:</span>
                        <p className="mt-1 p-2 bg-gray-100 rounded text-sm">
                          {selectedApplication.earlyReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Form */}
                <div>
                  <h4 className="font-medium mb-2">Review Decision</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Decision</label>
                      <select
                        value={reviewData.status}
                        onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                        className="mt-1 input-field"
                      >
                        <option value="">Select decision</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Reason/Comments {reviewData.status === 'rejected' && '*'}
                      </label>
                      <textarea
                        value={reviewData.reason}
                        onChange={(e) => setReviewData({ ...reviewData, reason: e.target.value })}
                        rows={3}
                        className="mt-1 input-field"
                        placeholder="Enter reason or comments..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedApplication(null);
                      setReviewData({ status: '', reason: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReview(selectedApplication._id, reviewData.status, reviewData.reason)}
                    disabled={!reviewData.status || (reviewData.status === 'rejected' && !reviewData.reason)}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewApplications;