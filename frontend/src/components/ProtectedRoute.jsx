import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole, adminOnly = false, permissions = [] }) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aastu-blue"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login page based on current path
    const redirectPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/student/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check for specific role requirement
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // Check for admin-only access
  if (adminOnly && user.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Check for specific permissions
  if (permissions.length > 0) {
    const hasRequiredPermission = permissions.some(permission => hasPermission(permission));
    if (!hasRequiredPermission) {
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = user.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
      return <Navigate to={dashboardPath} replace />;
    }
  }

  // Handle legacy dashboard route - redirect to role-specific dashboard
  if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    const dashboardPath = user.role === 'student' ? '/student/dashboard' : '/admin/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;