import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const StudentRegisterForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { adminRegisterStudent } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const watchCollege = watch('college');

  const departments = {
    engineering: [
      'Architecture',
      'Chemical Engineering',
      'Civil Engineering',
      'Electrical and Computer Engineering',
      'Electromechanical Engineering',
      'Environmental Engineering',
      'Mechanical Engineering',
      'Mining Engineering',
      'Software Engineering'
    ],
    natural_science: [
      'Biotechnology',
      'Food Science and Applied Nutrition',
      'Geology',
      'Industrial Chemistry'
    ],
    social_science: [
      'Freshman',
      'Pre-Engineering'
    ]
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const studentData = {
      ...data,
      role: 'student'
    };
    const success = await adminRegisterStudent(studentData);
    if (success) {
      onSuccess?.();
      onClose?.();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Register Student</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            type="text"
            className="input-field mt-1"
            placeholder="Enter student's full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="input-field mt-1"
            placeholder="Enter student's email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            {...register('studentId', { 
              required: 'Student ID is required',
              pattern: {
                value: /^[A-Za-z0-9\/\-]+$/,
                message: 'Invalid student ID format'
              }
            })}
            type="text"
            className="input-field mt-1"
            placeholder="Enter student ID (e.g., ETS0123/14)"
          />
          {errors.studentId && (
            <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            College
          </label>
          <select
            {...register('college', { required: 'College is required' })}
            className="input-field mt-1"
          >
            <option value="">Select college</option>
            <option value="engineering">College of Engineering</option>
            <option value="natural_science">College of Natural and Applied Science</option>
            <option value="social_science">College of Social Science and Humanities</option>
          </select>
          {errors.college && (
            <p className="mt-1 text-sm text-red-600">{errors.college.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register('department', { required: 'Department is required' })}
            className="input-field mt-1"
          >
            <option value="">Select department</option>
            {watchCollege && departments[watchCollege]?.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year Level
          </label>
          <select
            {...register('yearLevel', { required: 'Year level is required' })}
            className="input-field mt-1"
          >
            <option value="">Select year level</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="5">5th Year</option>
          </select>
          {errors.yearLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.yearLevel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Password
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            type="password"
            className="input-field mt-1"
            placeholder="Create temporary password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            The student will be required to change this password on first login.
          </p>
        </div>

        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
          <input
            {...register('sendEmail', { value: true })}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            defaultChecked
          />
          <label className="ml-2 block text-sm text-blue-800">
            Send login credentials to student via email
          </label>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegisterForm;