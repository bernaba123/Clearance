import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Search, Filter, Building } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DepartmentHeadManagement = () => {
  const { user } = useAuth();
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHead, setEditingHead] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const colleges = {
    engineering: 'Engineering & Technology',
    natural_sciences: 'Natural & Computational Sciences',
    social_sciences: 'Social Sciences & Humanities'
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
    natural_sciences: [
      'Biotechnology',
      'Food Science and Applied Nutrition',
      'Geology',
      'Industrial Chemistry'
    ],
    social_sciences: [
      'Freshman',
      'Pre-Engineering'
    ]
  };

  // Get departments for current user's college or all departments as fallback
  const getAvailableDepartments = () => {
    const userCollege = user?.college;
    console.log('DeptHead - Getting departments for college:', userCollege);
    
    if (userCollege && departments[userCollege]) {
      console.log('DeptHead - Found departments for college:', departments[userCollege]);
      return departments[userCollege];
    }
    
    // Fallback: return all departments if no college specified or college not found
    const allDepartments = Object.values(departments).flat();
    console.log('DeptHead - Using fallback - all departments:', allDepartments);
    return allDepartments;
  };

  useEffect(() => {
    console.log('DepartmentHeadManagement - Current user:', user);
    console.log('DepartmentHeadManagement - User college:', user?.college);
    console.log('DepartmentHeadManagement - Available departments:', departments[user?.college]);
    fetchDepartmentHeads();
  }, [user]);

  const fetchDepartmentHeads = async () => {
    try {
      const response = await axios.get('/api/admin/registrar/department-heads');
      setDepartmentHeads(response.data);
    } catch (error) {
      console.error('Error fetching department heads:', error);
      toast.error('Failed to fetch department heads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting department head data:', { ...formData, password: formData.password ? '[HIDDEN]' : 'Not provided' });
      
      const headData = {
        ...formData,
        role: 'department_head',
        college: user.college
      };

      if (editingHead) {
        const response = await axios.put(`/api/admin/registrar/department-heads/${editingHead._id}`, headData);
        console.log('Update response:', response.data);
        toast.success('Department head updated successfully');
      } else {
        const response = await axios.post('/api/admin/registrar/department-heads', headData);
        console.log('Create response:', response.data);
        toast.success('Department head created successfully');
      }
      setShowModal(false);
      setEditingHead(null);
      setFormData({
        fullName: '',
        email: '',
        department: '',
        password: ''
      });
      fetchDepartmentHeads();
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message || err).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Operation failed');
      }
    }
  };

  const handleEdit = (head) => {
    setEditingHead(head);
    setFormData({
      fullName: head.fullName,
      email: head.email,
      department: head.department,
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (headId, headName) => {
    if (window.confirm(`Are you sure you want to delete ${headName}?`)) {
      try {
        await axios.delete(`/api/admin/registrar/department-heads/${headId}`);
        toast.success('Department head deleted successfully');
        fetchDepartmentHeads();
      } catch (error) {
        toast.error('Failed to delete department head');
      }
    }
  };

  const filteredHeads = departmentHeads.filter(head => {
    const matchesSearch = head.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         head.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         head.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || head.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Department Head Management</h1>
          <p className="text-gray-600">
            Manage department heads in {colleges[user?.college]} - {user?.college ? departmentHeads.length : 0} department heads
          </p>
        </div>
        <button
          onClick={() => {
            setEditingHead(null);
            setFormData({
              fullName: '',
              email: '',
              department: '',
              password: ''
            });
            setShowModal(true);
          }}
          className="bg-aastu-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Department Head
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search department heads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-aastu-blue focus:border-aastu-blue w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-aastu-blue focus:border-aastu-blue w-full"
            >
              <option value="all">All Departments</option>
              {getAvailableDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Department Heads Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Department Heads in {colleges[user?.college]}</h2>
          
          {filteredHeads.length === 0 ? (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No department heads found</p>
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
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHeads.map((head) => (
                    <tr key={head._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {head.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {head.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {head.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          head.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {head.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(head)}
                            className="text-aastu-blue hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(head._id, head.fullName)}
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
                {editingHead ? 'Edit Department Head' : 'Add New Department Head'}
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
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                  >
                    <option value="">Select Department</option>
                    {getAvailableDepartments().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password {editingHead && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingHead}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                    placeholder={editingHead ? "Leave blank to keep current password" : "Enter password"}
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
                    {editingHead ? 'Update' : 'Create'}
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

export default DepartmentHeadManagement;