import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Generic login function for both students and admins
  const login = async (email, password, userType = 'any') => {
    try {
      const response = await axios.post('/api/auth/login', { email, password, userType });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Student-specific login
  const studentLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/student/login', { email, password });
      const { token, user } = response.data;
      
      // Verify user is a student
      if (user.role !== 'student') {
        toast.error('Invalid credentials for student login');
        return false;
      }
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Welcome back, student!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Student login failed');
      return false;
    }
  };

  // Admin-specific login
  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/admin/login', { email, password });
      const { token, user } = response.data;
      
      // Verify user is an admin (not a student)
      if (user.role === 'student') {
        toast.error('Invalid credentials for admin login');
        return false;
      }
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success(`Welcome back, ${getRoleDisplayName(user.role)}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
      return false;
    }
  };

  // Student registration
  const studentRegister = async (userData) => {
    try {
      const response = await axios.post('/api/auth/student/register', userData);
      toast.success('Student registration successful! Please login.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Student registration failed');
      return false;
    }
  };

  // Admin registration (only accessible by system/registrar admins)
  const adminRegister = async (userData) => {
    try {
      const response = await axios.post('/api/auth/admin/register', userData);
      toast.success(`${getRoleDisplayName(userData.role)} account created successfully!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin registration failed');
      return false;
    }
  };

  // Get user role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'student': 'Student',
      'system_admin': 'System Administrator',
      'registrar_admin': 'Registrar Administrator',
      'department_head': 'Department Head',
      'chief_librarian': 'Chief Librarian',
      'dormitory_proctor': 'Dormitory Proctor',
      'dining_officer': 'Dining Officer',
      'student_affairs': 'Student Affairs Officer',
      'student_discipline': 'Student Discipline Officer',
      'cost_sharing': 'Cost Sharing Officer'
    };
    return roleNames[role] || role;
  };

  // Check if user has specific permissions
  const hasPermission = (permission) => {
    if (!user) return false;
    
    const permissions = {
      'register_admins': ['system_admin'],
      'register_registrar_and_department_heads': ['registrar_admin'],
      'view_all_clearances': ['system_admin', 'registrar_admin'],
      'approve_clearances': ['department_head', 'chief_librarian', 'dormitory_proctor', 'dining_officer', 'student_affairs', 'student_discipline', 'cost_sharing'],
      'manage_users': ['system_admin', 'registrar_admin'],
      'view_statistics': ['system_admin', 'registrar_admin', 'department_head']
    };
    
    return permissions[permission]?.includes(user.role) || false;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role !== 'student';
  };

  // Check if user is student
  const isStudent = () => {
    return user && user.role === 'student';
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    studentLogin,
    adminLogin,
    studentRegister,
    adminRegister,
    logout,
    loading,
    hasPermission,
    isAdmin,
    isStudent,
    getRoleDisplayName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};