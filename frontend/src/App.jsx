import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';

// Public pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Help from './pages/Help.jsx';
import News from './pages/News.jsx';

// Student authentication
import StudentLogin from './pages/auth/student/StudentLogin.jsx';
import StudentRegister from './pages/auth/student/StudentRegister.jsx';

// Admin authentication
import AdminLogin from './pages/auth/admin/AdminLogin.jsx';

// Dashboard (will be split into student/admin later)
import Dashboard from './pages/Dashboard.jsx';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/news" element={<News />} />

              {/* Student authentication routes */}
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/register" element={<StudentRegister />} />
              
              {/* Admin authentication routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Legacy routes - redirect to appropriate auth pages */}
              <Route path="/login" element={<Navigate to="/student/login" replace />} />
              <Route path="/register" element={<Navigate to="/student/register" replace />} />

              {/* Protected dashboard routes */}
              <Route 
                path="/student/dashboard/*" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard/*" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy dashboard route - redirect based on user role */}
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;