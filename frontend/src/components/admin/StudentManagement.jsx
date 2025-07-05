import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Search, Filter, GraduationCap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext.jsx';

const StudentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: '',
    yearLevel: '',
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
    console.log('Getting departments for college:', userCollege);
    
    if (userCollege && departments[userCollege]) {
      console.log('Found departments for college:', departments[userCollege]);
      return departments[userCollege];
    }
    
    // Fallback: return all departments if no college specified or college not found
    const allDepartments = Object.values(departments).flat();
    console.log('Using fallback - all departments:', allDepartments);
    return allDepartments;
  };

  useEffect(() => {
    console.log('StudentManagement - Current user:', user);
    console.log('StudentManagement - User college:', user?.college);
    console.log('StudentManagement - Available departments:', departments[user?.college]);
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/registrar/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting student data:', { ...formData, password: formData.password ? '[HIDDEN]' : 'Not provided' });
      
      const studentData = {
        ...formData,
        role: 'student',
        college: user.college
      };

      if (editingStudent) {
        const response = await axios.put(`/api/admin/registrar/students/${editingStudent._id}`, studentData);
        console.log('Update response:', response.data);
        toast.success('Student updated successfully');
      } else {
        const response = await axios.post('/api/admin/registrar/students', studentData);
        console.log('Create response:', response.data);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({
        fullName: '',
        email: '',
        studentId: '',
        department: '',
        yearLevel: '',
        password: ''
      });
      fetchStudents();
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

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      studentId: student.studentId,
      department: student.department,
      yearLevel: student.yearLevel.toString(),
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      try {
        await axios.delete(`/api/admin/registrar/students/${studentId}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    
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
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">
            Manage students in {colleges[user?.college]} - {user?.college ? students.length : 0} students
          </p>
        </div>
        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({
              fullName: '',
              email: '',
              studentId: '',
              department: '',
              yearLevel: '',
              password: ''
            });
            setShowModal(true);
          }}
          className="bg-aastu-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
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

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Students in {colleges[user?.college]}</h2>
          
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
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
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {student.studentId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Year {student.yearLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-aastu-blue hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id, student.fullName)}
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
                {editingStudent ? 'Edit Student' : 'Add New Student'}
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
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                    placeholder="e.g., ETS0123/14"
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
                  <label className="block text-sm font-medium text-gray-700">Year Level</label>
                  <select
                    required
                    value={formData.yearLevel}
                    onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password {editingStudent && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingStudent}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-aastu-blue focus:border-aastu-blue"
                    placeholder={editingStudent ? "Leave blank to keep current password" : "Enter password"}
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
                    {editingStudent ? 'Update' : 'Create'}
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

export default StudentManagement;