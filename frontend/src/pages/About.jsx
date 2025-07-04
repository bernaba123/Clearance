import React from 'react';
import { GraduationCap, Target, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-aastu-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">About AASTU Clearance System</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Streamlining the student clearance process at Addis Ababa Science and Technology University
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Target className="h-12 w-12 text-aastu-blue mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To provide a comprehensive, efficient, and user-friendly digital platform that simplifies 
                the student clearance process at AASTU, ensuring transparency, accountability, and timely 
                completion of all clearance requirements.
              </p>
              <p className="text-lg text-gray-600">
                We aim to eliminate bureaucratic delays and create a seamless experience for students, 
                faculty, and administrative staff throughout the clearance workflow.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aastu-blue rounded-full mr-3"></div>
                  <span>Paperless clearance process</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aastu-blue rounded-full mr-3"></div>
                  <span>Real-time status tracking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aastu-blue rounded-full mr-3"></div>
                  <span>Automated PDF certificate generation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aastu-blue rounded-full mr-3"></div>
                  <span>Multi-role access control</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-aastu-blue rounded-full mr-3"></div>
                  <span>Centralized communication</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to complete your clearance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-aastu-blue text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Apply</h3>
              <p className="text-gray-600">Submit your clearance application through the system</p>
            </div>
            
            <div className="text-center">
              <div className="bg-aastu-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Review</h3>
              <p className="text-gray-600">Various departments review and approve your application</p>
            </div>
            
            <div className="text-center">
              <div className="bg-aastu-gold text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Approve</h3>
              <p className="text-gray-600">Final approval from registrar after all departments clear</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Download</h3>
              <p className="text-gray-600">Download your official clearance certificate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 text-aastu-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Users</h2>
            <p className="text-xl text-gray-600">Supporting all stakeholders in the clearance process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">Students</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Apply for clearance</li>
                <li>• Track application status</li>
                <li>• Download certificates</li>
                <li>• View requirements</li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">Department Heads</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review student applications</li>
                <li>• Approve/reject clearances</li>
                <li>• Manage department students</li>
                <li>• View clearance history</li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">Registrar Admins</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Final clearance approval</li>
                <li>• Manage department heads</li>
                <li>• System configuration</li>
                <li>• Generate reports</li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">Administrative Staff</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Library clearance</li>
                <li>• Dormitory clearance</li>
                <li>• Dining services</li>
                <li>• Student affairs</li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">System Admins</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• User management</li>
                <li>• System configuration</li>
                <li>• News management</li>
                <li>• System monitoring</li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">Support Staff</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Student discipline</li>
                <li>• Cost sharing</li>
                <li>• Technical support</li>
                <li>• Process guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-aastu-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl mb-8">
            Our support team is here to assist you with any questions about the clearance process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/help" className="bg-white text-aastu-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Visit Help Center
            </a>
            <a href="mailto:support@aastu.edu.et" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-aastu-blue transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;