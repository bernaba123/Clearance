import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I apply for clearance?",
      answer: "To apply for clearance, log into your student account and navigate to the 'Apply for Clearance' section. Fill out the required information and submit your application. You can only apply when the clearance system is active."
    },
    {
      question: "What documents do I need for clearance?",
      answer: "The required documents vary by department but typically include: student ID verification, library clearance, dormitory clearance (if applicable), dining services clearance, and any department-specific requirements. Check with your department head for specific requirements."
    },
    {
      question: "How long does the clearance process take?",
      answer: "The clearance process typically takes 5-10 business days, depending on the responsiveness of various departments. You can track your application status in real-time through your dashboard."
    },
    {
      question: "What if my clearance is rejected?",
      answer: "If your clearance is rejected by any department, you'll receive a notification with the reason for rejection. You'll need to resolve the issue with that specific department before reapplying."
    },
    {
      question: "Can I apply for early clearance?",
      answer: "Early clearance is only available if enabled by your registrar admin. If available, you'll need to provide a valid reason for requesting early clearance."
    },
    {
      question: "How do I download my clearance certificate?",
      answer: "Once your clearance is fully approved, you can download your official clearance certificate from your dashboard. The certificate will be in PDF format and include all necessary details."
    },
    {
      question: "Who can I contact if I have issues?",
      answer: "For technical issues, contact the system administrator. For clearance-related questions, contact your department head or registrar admin. For general inquiries, use the contact information provided below."
    },
    {
      question: "What if I forgot my password?",
      answer: "Use the 'Forgot Password' link on the login page to reset your password. You'll receive an email with instructions to create a new password."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-aastu-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Find answers to common questions and get support for the AASTU Clearance System
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Guides Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">User Guides</h2>
            <p className="text-xl text-gray-600">Step-by-step guides for different user roles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Student Guide</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• How to register and login</li>
                <li>• Applying for clearance</li>
                <li>• Tracking application status</li>
                <li>• Downloading certificates</li>
                <li>• Understanding requirements</li>
              </ul>
              <button className="mt-4 text-aastu-blue hover:text-blue-700 font-medium">
                View Full Guide →
              </button>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Department Head Guide</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Managing student applications</li>
                <li>• Approval/rejection process</li>
                <li>• Viewing department statistics</li>
                <li>• Communication with students</li>
                <li>• Generating reports</li>
              </ul>
              <button className="mt-4 text-aastu-blue hover:text-blue-700 font-medium">
                View Full Guide →
              </button>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Admin Guide</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• User management</li>
                <li>• System configuration</li>
                <li>• Managing clearance periods</li>
                <li>• News and announcements</li>
                <li>• System monitoring</li>
              </ul>
              <button className="mt-4 text-aastu-blue hover:text-blue-700 font-medium">
                View Full Guide →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-xl text-gray-600">Still need help? Get in touch with our support team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <Mail className="h-12 w-12 text-aastu-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email</p>
              <a href="mailto:clearance@aastu.edu.et" className="text-aastu-blue hover:text-blue-700 font-medium">
                clearance@aastu.edu.et
              </a>
            </div>
            
            <div className="card p-6 text-center">
              <Phone className="h-12 w-12 text-aastu-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us during business hours</p>
              <a href="tel:+251111234567" className="text-aastu-green hover:text-green-700 font-medium">
                +251 11 123 4567
              </a>
            </div>
            
            <div className="card p-6 text-center">
              <MessageCircle className="h-12 w-12 text-aastu-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team</p>
              <button className="text-aastu-gold hover:text-orange-600 font-medium">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-aastu-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Support Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Support</h3>
              <p className="mb-2">Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p className="mb-2">Saturday: 9:00 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Registrar Office</h3>
              <p className="mb-2">Monday - Friday: 8:30 AM - 5:00 PM</p>
              <p className="mb-2">Saturday: 9:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;