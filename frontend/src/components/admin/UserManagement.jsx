import React, { useState } from 'react';
import { Users, Plus, Shield, UserPlus, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AdminRegisterForm from './AdminRegisterForm.jsx';
import StudentRegisterForm from './StudentRegisterForm.jsx';

const UserManagement = () => {
  const [showAdminRegisterForm, setShowAdminRegisterForm] = useState(false);
  const [showStudentRegisterForm, setShowStudentRegisterForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, hasPermission, getRoleDisplayName } = useAuth();

  const handleRegistrationSuccess = () => {
    // Refresh user list or show success message
    setShowAdminRegisterForm(false);
    setShowStudentRegisterForm(false);
    // You could also trigger a refresh of the user list here
  };

  const canRegisterAdmins = hasPermission('register_admins') || hasPermission('register_registrar_and_department_heads');
  const canRegisterStudents = hasPermission('register_students');

  if (!canRegisterAdmins && !canRegisterStudents) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600">
            You don't have permission to manage users.
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
              User Management
            </h3>
          </div>
          <div className="flex space-x-2">
            {canRegisterStudents && (
              <button
                onClick={() => setShowStudentRegisterForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Register Student
              </button>
            )}
            {canRegisterAdmins && (
              <button
                onClick={() => setShowAdminRegisterForm(true)}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition duration-200"
              >
                <Shield className="h-4 w-4 mr-2" />
                Register Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          {canRegisterAdmins && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin Management
            </button>
          )}
          {canRegisterStudents && (
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Student Management
            </button>
          )}
        </nav>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current User Info */}
                         <div className="p-4 bg-blue-50 rounded-lg">
               <h4 className="font-medium text-blue-900 mb-2">Your Privileges</h4>
               <p className="text-blue-700 text-sm">
                 <strong>Role:</strong> {getRoleDisplayName(user?.role)}
               </p>
               {user?.college && (
                 <p className="text-blue-700 text-sm mt-1">
                   <strong>Assigned College:</strong> {user.college.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                 </p>
               )}
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
               {hasPermission('register_students') && (
                 <p className="text-blue-700 text-sm mt-1">
                   ✓ Can register students for {user?.college ? user.college.replace('_', ' ') : 'assigned'} college
                 </p>
               )}
             </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {canRegisterStudents && (
                 <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                   <div className="flex items-center mb-3">
                     <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                     <h5 className="font-medium text-blue-900">Student Registration</h5>
                   </div>
                   <p className="text-sm text-blue-700 mb-3">
                     Create student accounts for {user?.college ? user.college.replace('_', ' ') : 'your assigned'} college
                   </p>
                   <button
                     onClick={() => setShowStudentRegisterForm(true)}
                     className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                   >
                     Register Student
                   </button>
                 </div>
               )}

              {canRegisterAdmins && (
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-slate-600 mr-2" />
                    <h5 className="font-medium text-slate-900">Admin Registration</h5>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Create admin accounts with appropriate roles and permissions
                  </p>
                  <button
                    onClick={() => setShowAdminRegisterForm(true)}
                    className="text-sm bg-slate-600 text-white px-3 py-1 rounded hover:bg-slate-700"
                  >
                    Register Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admins' && canRegisterAdmins && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Admin User Registration</h4>
              <button
                onClick={() => setShowAdminRegisterForm(true)}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register Admin
              </button>
            </div>

            {/* Available Admin Roles */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Available Admin Roles</h5>
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
          </div>
        )}

        {/* Student Management Tab */}
        {activeTab === 'students' && canRegisterStudents && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Student Registration</h4>
              <button
                onClick={() => setShowStudentRegisterForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register Student
              </button>
            </div>

                         {/* Student Registration Info */}
             <div className="p-4 bg-blue-50 rounded-lg">
               <h5 className="font-medium text-blue-900 mb-2">Student Registration Guidelines</h5>
               <ul className="text-sm text-blue-700 space-y-1">
                 <li>• You can only register students for your assigned college</li>
                 <li>• Complete academic information is required</li>
                 <li>• Student ID must be unique across the system</li>
                 <li>• Email addresses must be valid and unique</li>
                 <li>• Students will receive login credentials via email</li>
                 <li>• Students must change their password on first login</li>
               </ul>
             </div>

                         {user?.college ? (
               <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                 <div className="font-medium text-blue-900">Your Assigned College</div>
                 <div className="text-lg font-semibold text-blue-800 mt-1">
                   {user.college === 'engineering' && 'College of Engineering'}
                   {user.college === 'natural_science' && 'College of Natural and Applied Science'}
                   {user.college === 'social_science' && 'College of Social Science and Humanities'}
                 </div>
                 <div className="text-sm text-blue-700 mt-1">
                   {user.college === 'engineering' && '9 departments available'}
                   {user.college === 'natural_science' && '4 departments available'}
                   {user.college === 'social_science' && '2 programs available'}
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 border border-blue-200 rounded-lg">
                   <div className="font-medium text-blue-900">Engineering</div>
                   <div className="text-sm text-blue-700">9 departments available</div>
                 </div>
                 <div className="p-4 border border-green-200 rounded-lg">
                   <div className="font-medium text-green-900">Natural Science</div>
                   <div className="text-sm text-green-700">4 departments available</div>
                 </div>
                 <div className="p-4 border border-purple-200 rounded-lg">
                   <div className="font-medium text-purple-900">Social Science</div>
                   <div className="text-sm text-purple-700">2 programs available</div>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* Registration Form Modals */}
        {showAdminRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <AdminRegisterForm
              onClose={() => setShowAdminRegisterForm(false)}
              onSuccess={handleRegistrationSuccess}
            />
          </div>
        )}

        {showStudentRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <StudentRegisterForm
              onClose={() => setShowStudentRegisterForm(false)}
              onSuccess={handleRegistrationSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;