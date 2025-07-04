import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ViewStatus = () => {
  const [clearanceData, setClearanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClearanceStatus();
  }, []);

  const fetchClearanceStatus = async () => {
    try {
      const response = await axios.get('/api/clearance/status');
      setClearanceData(response.data);
    } catch (error) {
      console.error('Error fetching clearance status:', error);
      toast.error('Failed to fetch clearance status');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await axios.get('/api/clearance/certificate', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clearance-certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = () => {
    if (!clearanceData?.approvals) return 0;
    
    const totalSteps = clearanceData.approvals.length;
    const approvedSteps = clearanceData.approvals.filter(approval => approval.status === 'approved').length;
    
    return Math.round((approvedSteps / totalSteps) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aastu-blue"></div>
      </div>
    );
  }

  if (!clearanceData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Application Found</h3>
        <p className="text-gray-500 mb-4">You haven't submitted a clearance application yet.</p>
        <a href="/dashboard/apply" className="btn-primary">
          Apply for Clearance
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clearance Status</h1>
              <p className="text-gray-600">Track your clearance application progress</p>
            </div>
            <button
              onClick={fetchClearanceStatus}
              className="btn-secondary flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-aastu-blue">{getProgressPercentage()}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-aastu-blue h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Started: {new Date(clearanceData.createdAt).toLocaleDateString()}</span>
            {clearanceData.status === 'completed' && (
              <span>Completed: {new Date(clearanceData.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Application Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Type</label>
              <p className="mt-1 text-sm text-gray-900">
                {clearanceData.isEarlyApplication ? 'Early Clearance' : 'Regular Clearance'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(clearanceData.status)}`}>
                {clearanceData.status}
              </span>
            </div>
          </div>

          {clearanceData.isEarlyApplication && clearanceData.earlyReason && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Reason for Early Clearance</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                {clearanceData.earlyReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Steps */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Approval Steps</h2>
          
          <div className="space-y-4">
            {clearanceData.approvals?.map((approval, index) => (
              <div key={approval.adminType} className={`border rounded-lg p-4 ${getStatusColor(approval.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(approval.status)}
                    <div className="ml-3">
                      <h3 className="font-medium capitalize">
                        {approval.adminType.replace('_', ' ')}
                      </h3>
                      {approval.approvedBy && (
                        <p className="text-sm opacity-75">
                          Reviewed by: {approval.approvedBy.fullName}
                        </p>
                      )}
                      {approval.approvedAt && (
                        <p className="text-sm opacity-75">
                          {approval.status === 'approved' ? 'Approved' : 'Reviewed'} on: {new Date(approval.approvedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {approval.status}
                  </span>
                </div>
                
                {approval.reason && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
                    <p className="text-sm">
                      <strong>Note:</strong> {approval.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Certificate */}
      {clearanceData.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-green-800">
                  Congratulations! Your clearance has been approved.
                </h3>
                <p className="text-green-700">
                  You can now download your official clearance certificate.
                </p>
              </div>
              <button
                onClick={downloadCertificate}
                className="btn-success flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Notice */}
      {clearanceData.approvals?.some(approval => approval.status === 'rejected') && (
        <div className="bg-red-50 border border-red-200 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Application Rejected
                </h3>
                <p className="text-red-700">
                  Your clearance application has been rejected. Please review the reasons above and contact the relevant department to resolve any issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStatus;