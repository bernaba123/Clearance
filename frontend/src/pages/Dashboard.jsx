import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';

// Student Components
import StudentDashboard from '../components/student/StudentDashboard.jsx';
import ApplyClearance from '../components/student/ApplyClearance.jsx';
import ViewStatus from '../components/student/ViewStatus.jsx';

// Admin Components
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import ManageUsers from '../components/admin/ManageUsers.jsx';
import ManageNews from '../components/admin/ManageNews.jsx';

// Department Head Components
import DepartmentDashboard from '../components/department/DepartmentDashboard.jsx';
import ReviewApplications from '../components/department/ReviewApplications.jsx';

// Other Admin Components
import OtherAdminDashboard from '../components/other/OtherAdminDashboard.jsx';
import ManageProfile from '../components/other/ManageProfile.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'student':
        return (
          <Routes>
            <Route index element={<StudentDashboard />} />
            <Route path="apply" element={<ApplyClearance />} />
            <Route path="status" element={<ViewStatus />} />
          </Routes>
        );
      
      case 'system_admin':
      case 'registrar_admin':
        return (
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="news" element={<ManageNews />} />
          </Routes>
        );
      
      case 'department_head':
        return (
          <Routes>
            <Route index element={<DepartmentDashboard />} />
            <Route path="applications" element={<ReviewApplications />} />
          </Routes>
        );
      
      default:
        return (
          <Routes>
            <Route index element={<OtherAdminDashboard />} />
            <Route path="profile" element={<ManageProfile />} />
          </Routes>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;