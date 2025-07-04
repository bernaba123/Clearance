import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const ApplyClearance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const isEarlyApplication = watch('isEarlyApplication');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/api/clearance/apply', data);
      toast.success('Clearance application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-aastu-blue mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Apply for Clearance</h1>
              <p className="text-gray-600">Submit your clearance application</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Student Information (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    disabled
                    className="mt-1 input-field bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    value={user?.studentId || ''}
                    disabled
                    className="mt-1 input-field bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={user?.department || ''}
                    disabled
                    className="mt-1 input-field bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year Level</label>
                  <input
                    type="text"
                    value={user?.yearLevel ? `${user.yearLevel}${user.yearLevel === 1 ? 'st' : user.yearLevel === 2 ? 'nd' : user.yearLevel === 3 ? 'rd' : 'th'} Year` : ''}
                    disabled
                    className="mt-1 input-field bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Application Type */}
            <div>
              <label className="flex items-center">
                <input
                  {...register('isEarlyApplication')}
                  type="checkbox"
                  className="rounded border-gray-300 text-aastu-blue focus:ring-aastu-blue"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This is an early clearance application
                </span>
              </label>
            </div>

            {/* Early Application Reason */}
            {isEarlyApplication && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Early Clearance *
                </label>
                <textarea
                  {...register('earlyReason', {
                    required: isEarlyApplication ? 'Reason is required for early applications' : false
                  })}
                  rows={4}
                  className="mt-1 input-field"
                  placeholder="Please explain why you need early clearance..."
                />
                {errors.earlyReason && (
                  <p className="mt-1 text-sm text-red-600">{errors.earlyReason.message}</p>
                )}
              </div>
            )}

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Information (Optional)
              </label>
              <textarea
                {...register('additionalInfo')}
                rows={3}
                className="mt-1 input-field"
                placeholder="Any additional information you'd like to provide..."
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start">
                <input
                  {...register('agreeToTerms', {
                    required: 'You must agree to the terms and conditions'
                  })}
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-aastu-blue focus:ring-aastu-blue"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the terms and conditions and confirm that all information provided is accurate. 
                  I understand that providing false information may result in the rejection of my application.
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure all your obligations are cleared before applying</li>
                      <li>Your application will be reviewed by multiple departments</li>
                      <li>You will receive notifications about status updates</li>
                      <li>The process may take 5-10 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyClearance;