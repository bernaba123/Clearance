import React, { useState } from 'react';
import { Users, Plus, Shield, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AdminRegisterForm from './AdminRegisterForm.jsx';

const AdminUserManagement = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { user, hasPermission, getRoleDisplayName } = useAuth();

  const handleRegistrationSuccess = () => {
    // Refresh user list or show success message
    setShowRegisterForm(false);
    // You could also trigger a refresh of the user list here
  };

  if (!hasPermission('register_admins') && !hasPermission('register_registrar_and_department_heads')) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600">
            You don't have permission to manage admin users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Admin User Management
            </h3>
          </div>
          <button
            onClick={() => setShowRegisterForm(true)}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register Admin
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current User Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your Admin Privileges</h4>
          <p className="text-blue-700 text-sm">
            <strong>Role:</strong> {getRoleDisplayName(user?.role)}
          </p>
          {hasPermission('register_admins') && (
            <p className="text-blue-700 text-sm mt-1">
              ✓ Can register all admin types
            </p>
          )}
          {hasPermission('register_registrar_and_department_heads') && (
            <p className="text-blue-700 text-sm mt-1">
              ✓ Can register department heads and registrar admins
            </p>
          )}
        </div>

        {/* Registration Guidelines */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Registration Guidelines</h4>
          <div className="space-y-2 text-sm text-gray-600">
            {user?.role === 'system_admin' && (
              <>
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 text-green-500 mr-2" />
                  <span>You can register all admin types including system and registrar admins</span>
                </div>
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 text-green-500 mr-2" />
                  <span>Department heads, officers, and other administrative roles</span>
                </div>
              </>
            )}
            {user?.role === 'registrar_admin' && (
              <>
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 text-blue-500 mr-2" />
                  <span>You can register department heads and other registrar admins</span>
                </div>
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400">System admins and officers require system admin approval</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Admin Types Available for Registration */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Available Admin Roles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user?.role === 'system_admin' && (
              <>
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="font-medium text-green-900">Registrar Administrator</div>
                  <div className="text-sm text-green-700">Can manage students and register department heads</div>
                </div>
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="font-medium text-blue-900">Department Head</div>
                  <div className="text-sm text-blue-700">Manages department-specific clearances</div>
                </div>
                <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="font-medium text-purple-900">Service Officers</div>
                  <div className="text-sm text-purple-700">Library, dining, dormitory, and other services</div>
                </div>
              </>
            )}
            {user?.role === 'registrar_admin' && (
              <>
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="font-medium text-green-900">Registrar Administrator</div>
                  <div className="text-sm text-green-700">Another registrar admin like yourself</div>
                </div>
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="font-medium text-blue-900">Department Head</div>
                  <div className="text-sm text-blue-700">Manages department-specific clearances</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Registration Form Modal */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <AdminRegisterForm
              onClose={() => setShowRegisterForm(false)}
              onSuccess={handleRegistrationSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;