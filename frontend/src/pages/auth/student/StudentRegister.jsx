import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus, GraduationCap, XCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import axios from 'axios';

const StudentRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ registrationActive: true });
  const [statusLoading, setStatusLoading] = useState(true);
  const { studentRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');
  const watchCollege = watch('college');

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const response = await axios.get('/api/admin/public/system-status');
      setSystemStatus(response.data);
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

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
    if (!systemStatus.registrationActive) {
      return;
    }
    
    setLoading(true);
    const studentData = {
      ...data,
      role: 'student'
    };
    const success = await studentRegister(studentData);
    if (success) {
      navigate('/student/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-aastu-blue" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Student Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your student account to access the clearance system
          </p>
          
          {!statusLoading && !systemStatus.registrationActive && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-center items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">
                  <strong>Registration Disabled:</strong> Student registration is currently disabled. 
                  Please contact the administration for more information.
                </p>
              </div>
            </div>
          )}
          
          {!statusLoading && systemStatus.registrationActive && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Already have an account?{' '}
                <Link to="/student/login" className="font-medium text-aastu-blue hover:text-blue-700">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
        
        {statusLoading ? (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aastu-blue mx-auto"></div>
            <p className="mt-2 text-gray-600">Checking system status...</p>
          </div>
        ) : systemStatus.registrationActive ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                type="text"
                className="input-field mt-1"
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
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
                placeholder="Enter your student ID (e.g., ETS0123/14)"
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
                <option value="">Select your college</option>
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
                <option value="">Select your department</option>
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
                <option value="">Select your year</option>
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
                Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...register('agreeToTerms', { required: 'You must agree to the terms and conditions' })}
              type="checkbox"
              className="h-4 w-4 text-aastu-blue focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-aastu-blue hover:text-blue-700">
                Terms and Conditions
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-aastu-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'Creating account...' : 'Create Student Account'}
            </button>
          </div>
        </form>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-gray-600">Registration is currently disabled. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegister;