import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, FileCheck, Award, Calendar, Bell } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingClearances: 0,
    completedClearances: 0,
    activeAdmins: 0
  });

  useEffect(() => {
    fetchNews();
    fetchStats();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news');
      setNews(response.data.slice(0, 3)); // Get latest 3 news items
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/public');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-aastu-blue to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GraduationCap className="h-20 w-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AASTU Student Clearance System
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Streamlined clearance process for Addis Ababa Science and Technology University students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-aastu-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
              <Link to="/about" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-aastu-blue transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-aastu-blue mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.totalStudents}</div>
              <div className="text-gray-600">Total Students</div>
            </div>
            <div className="text-center">
              <FileCheck className="h-12 w-12 text-aastu-green mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.completedClearances}</div>
              <div className="text-gray-600">Completed Clearances</div>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 text-aastu-gold mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.pendingClearances}</div>
              <div className="text-gray-600">Pending Clearances</div>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.activeAdmins}</div>
              <div className="text-gray-600">Active Admins</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Features</h2>
            <p className="text-xl text-gray-600">Comprehensive clearance management for all stakeholders</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <FileCheck className="h-12 w-12 text-aastu-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Digital Clearance</h3>
              <p className="text-gray-600">Complete your clearance process entirely online with real-time status updates</p>
            </div>
            
            <div className="card p-6 text-center">
              <Users className="h-12 w-12 text-aastu-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multi-Role Support</h3>
              <p className="text-gray-600">Supports students, department heads, registrars, and various administrative roles</p>
            </div>
            
            <div className="card p-6 text-center">
              <Award className="h-12 w-12 text-aastu-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">PDF Generation</h3>
              <p className="text-gray-600">Automatically generate official clearance certificates upon completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest News & Events</h2>
            <Link to="/news" className="text-aastu-blue hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item._id} className="card p-6">
                <div className="flex items-center mb-3">
                  <Bell className="h-5 w-5 text-aastu-blue mr-2" />
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-aastu-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of AASTU students using our clearance system</p>
          <Link to="/register" className="bg-white text-aastu-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;