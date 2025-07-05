import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Search, Filter } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SystemUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    college: '',
    department: '',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const adminRoles = [
    { value: 'registrar_admin', label: 'Registrar Administrator', needsCollege: true },
    { value: 'chief_librarian', label: 'Chief Librarian', needsCollege: false },
    { value: 'dormitory_proctor', label: 'Dormitory Proctor', needsCollege: false },
    { value: 'dining_officer', label: 'Dining Officer', needsCollege: false },
    { value: 'student_affairs', label: 'Student Affairs Officer', needsCollege: false },
    { value: 'student_discipline', label: 'Student Discipline Officer', needsCollege: false },
    { value: 'cost_sharing', label: 'Cost Sharing Officer', needsCollege: false }
  ];

  const colleges = [
    { value: 'engineering', label: 'Engineering & Technology' },
    { value: 'natural_sciences', label: 'Natural & Computational Sciences' },
    { value: 'social_sciences', label: 'Social Sciences & Humanities' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/system-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', { ...formData, password: formData.password ? '[HIDDEN]' : 'Not provided' });
      
      if (editingUser) {
        const response = await axios.put(`/api/admin/users/${editingUser._id}`, formData);
        console.log('Update response:', response.data);
        toast.success('User updated successfully');
      } else {
        const response = await axios.post('/api/admin/users', formData);
        console.log('Create response:', response.data);
        toast.success('User created successfully');
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        fullName: '',
        email: '',
        role: '',
        college: '',
        department: '',
        password: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map(err => err.message || err).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Operation failed');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      college: user.college || '',
      department: user.department || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    // Exclude students and department heads (they are managed by registrars)
    const isManageableBySystemAdmin = !['student', 'department_head'].includes(user.role);
    
    return matchesSearch && matchesRole && isManageableBySystemAdmin;
  });

  const selectedRole = adminRoles.find(role => role.value === formData.role);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System User Management</h1>
          <p className="text-gray-600">Manage registrars and administrative users</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              fullName: '',
              email: '',
              role: '',
              college: '',
              department: '',
              password: ''
            });
            setShowModal(true);
          }}
          className="bg-aastu-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-aastu-blue focus:border-aastu-blue w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-aastu-blue focus:border-aastu-blue w-full"
            >
              <option value="all">All Roles</option>
              {adminRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Administrative Users</h2>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College/Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {adminRoles.find(r => r.value === user.role)?.label || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.college && colleges.find(c => c.value === user.college)?.label}
                        {user.department && ` - ${user.department}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-aastu-blue hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.fullName)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value, college: '', department: '' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                  >
                    <option value="">Select Role</option>
                    {adminRoles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                
                {selectedRole?.needsCollege && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">College</label>
                    <select
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                    >
                      <option value="">Select College</option>
                      {colleges.map(college => (
                        <option key={college.value} value={college.value}>{college.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password {editingUser && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                    placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-aastu-blue border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemUserManagement;