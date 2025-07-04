import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Shield, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const AdminRegisterForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { adminRegister, user, hasPermission } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const watchRole = watch('role');

  // Define available roles based on current user's permissions
  const getAvailableRoles = () => {
    if (hasPermission('register_admins')) {
      // System admin can register all admin types
      return [
        { value: 'registrar_admin', label: 'Registrar Administrator' },
        { value: 'department_head', label: 'Department Head' },
        { value: 'chief_librarian', label: 'Chief Librarian' },
        { value: 'dormitory_proctor', label: 'Dormitory Proctor' },
        { value: 'dining_officer', label: 'Dining Officer' },
        { value: 'student_affairs', label: 'Student Affairs Officer' },
        { value: 'student_discipline', label: 'Student Discipline Officer' },
        { value: 'cost_sharing', label: 'Cost Sharing Officer' }
      ];
    } else if (hasPermission('register_registrar_and_department_heads')) {
      // Registrar admin can only register department heads and other registrar admins
      return [
        { value: 'registrar_admin', label: 'Registrar Administrator' },
        { value: 'department_head', label: 'Department Head' }
      ];
    }
    return [];
  };

  const departments = [
    'Architecture',
    'Chemical Engineering',
    'Civil Engineering',
    'Electrical and Computer Engineering',
    'Electromechanical Engineering',
    'Environmental Engineering',
    'Mechanical Engineering',
    'Mining Engineering',
    'Software Engineering',
    'Biotechnology',
    'Food Science and Applied Nutrition',
    'Geology',
    'Industrial Chemistry',
    'Freshman',
    'Pre-Engineering'
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    const success = await adminRegister(data);
    if (success) {
      onSuccess?.();
      onClose?.();
    }
    setLoading(false);
  };

  const availableRoles = getAvailableRoles();

  if (availableRoles.length === 0) {
    return (
      <div className="text-center p-6">
        <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">You don't have permission to register admin users.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <UserPlus className="h-6 w-6 text-slate-900 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Register Admin User</h2>
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
            placeholder="Enter full name"
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
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="input-field mt-1"
          >
            <option value="">Select admin role</option>
            {availableRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {watchRole === 'department_head' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              {...register('department', { required: 'Department is required for department heads' })}
              className="input-field mt-1"
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>
        )}

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
            The user will be required to change this password on first login.
          </p>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRegisterForm;