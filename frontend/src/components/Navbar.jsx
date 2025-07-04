import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b-4 border-aastu-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-aastu-blue" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-aastu-blue">AASTU</span>
                <span className="text-xs text-gray-600">Clearance System</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-aastu-blue transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-aastu-blue transition-colors">
              About Us
            </Link>
            <Link to="/news" className="text-gray-700 hover:text-aastu-blue transition-colors">
              News/Events
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-aastu-blue transition-colors">
              Help
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.fullName}</span>
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                  className="text-aastu-blue hover:text-blue-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowAuthMenu(!showAuthMenu)}
                    className="text-gray-700 hover:text-aastu-blue flex items-center"
                  >
                    Sign In
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {showAuthMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/student/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        Student Login
                      </Link>
                      <Link
                        to="/admin/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        Admin Login
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <Link
                        to="/student/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAuthMenu(false)}
                      >
                        Student Registration
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-aastu-blue"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-aastu-blue"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-aastu-blue"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/news"
              className="block px-3 py-2 text-gray-700 hover:text-aastu-blue"
              onClick={() => setIsOpen(false)}
            >
              News/Events
            </Link>
            <Link
              to="/help"
              className="block px-3 py-2 text-gray-700 hover:text-aastu-blue"
              onClick={() => setIsOpen(false)}
            >
              Help
            </Link>
            
            {user ? (
              <>
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                  className="block px-3 py-2 text-aastu-blue font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/');
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Student
                </div>
                <Link
                  to="/student/login"
                  className="block px-3 py-2 text-gray-700 hover:text-aastu-blue ml-4"
                  onClick={() => setIsOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/student/register"
                  className="block px-3 py-2 text-aastu-blue ml-4"
                  onClick={() => setIsOpen(false)}
                >
                  Student Registration
                </Link>
                <div className="px-3 py-2 text-sm font-medium text-gray-500 mt-2">
                  Administrator
                </div>
                <Link
                  to="/admin/login"
                  className="block px-3 py-2 text-gray-700 hover:text-aastu-blue ml-4"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;