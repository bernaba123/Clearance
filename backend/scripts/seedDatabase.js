import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import News from '../models/News.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aastu-clearance');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await News.deleteMany({});
    console.log('Cleared existing data');

    // Create system admin
    const systemAdmin = new User({
      fullName: 'System Administrator',
      email: 'admin@aastu.edu.et',
      password: 'admin123',
      role: 'system_admin'
    });
    await systemAdmin.save();

    // Create registrar admin
    const registrarAdmin = new User({
      fullName: 'Engineering Registrar',
      email: 'registrar.eng@aastu.edu.et',
      password: 'registrar123',
      role: 'registrar_admin'
    });
    await registrarAdmin.save();

    // Create department head
    const deptHead = new User({
      fullName: 'Software Engineering Head',
      email: 'head.se@aastu.edu.et',
      password: 'head123',
      role: 'department_head',
      department: 'Software Engineering'
    });
    await deptHead.save();

    // Create other admins
    const otherAdmins = [
      {
        fullName: 'Chief Librarian',
        email: 'librarian@aastu.edu.et',
        password: 'librarian123',
        role: 'chief_librarian'
      },
      {
        fullName: 'Dormitory Proctor',
        email: 'proctor@aastu.edu.et',
        password: 'proctor123',
        role: 'dormitory_proctor'
      },
      {
        fullName: 'Dining Officer',
        email: 'dining@aastu.edu.et',
        password: 'dining123',
        role: 'dining_officer'
      },
      {
        fullName: 'Student Affairs Dean',
        email: 'affairs@aastu.edu.et',
        password: 'affairs123',
        role: 'student_affairs'
      },
      {
        fullName: 'Student Discipline Officer',
        email: 'discipline@aastu.edu.et',
        password: 'discipline123',
        role: 'student_discipline'
      },
      {
        fullName: 'Cost Sharing Officer',
        email: 'costsharing@aastu.edu.et',
        password: 'cost123',
        role: 'cost_sharing'
      }
    ];

    for (const adminData of otherAdmins) {
      const admin = new User(adminData);
      await admin.save();
    }

    // Create sample students
    const students = [
      {
        fullName: 'John Doe',
        email: 'john.doe@student.aastu.edu.et',
        password: 'student123',
        role: 'student',
        studentId: 'AASTU/SE/001/2020',
        department: 'Software Engineering',
        college: 'engineering',
        yearLevel: 4
      },
      {
        fullName: 'Jane Smith',
        email: 'jane.smith@student.aastu.edu.et',
        password: 'student123',
        role: 'student',
        studentId: 'AASTU/CE/002/2021',
        department: 'Civil Engineering',
        college: 'engineering',
        yearLevel: 3
      },
      {
        fullName: 'Alice Johnson',
        email: 'alice.johnson@student.aastu.edu.et',
        password: 'student123',
        role: 'student',
        studentId: 'AASTU/BT/003/2022',
        department: 'Biotechnology',
        college: 'natural_science',
        yearLevel: 2
      }
    ];

    for (const studentData of students) {
      const student = new User(studentData);
      await student.save();
    }

    // Create sample news
    const newsItems = [
      {
        title: 'Clearance System Now Online',
        content: 'The new digital clearance system is now live. Students can apply for clearance online and track their progress in real-time.',
        category: 'announcement',
        author: systemAdmin._id
      },
      {
        title: 'Academic Year End Clearance Deadline',
        content: 'All students must complete their clearance process before the end of the academic year. Late applications will require special approval.',
        category: 'deadline',
        author: registrarAdmin._id
      },
      {
        title: 'System Maintenance Schedule',
        content: 'The clearance system will undergo maintenance every Sunday from 2:00 AM to 4:00 AM. Please plan your submissions accordingly.',
        category: 'update',
        author: systemAdmin._id
      }
    ];

    for (const newsData of newsItems) {
      const news = new News(newsData);
      await news.save();
    }

    console.log('Database seeded successfully!');
    console.log('\nDefault accounts created:');
    console.log('System Admin: admin@aastu.edu.et / admin123');
    console.log('Registrar: registrar.eng@aastu.edu.et / registrar123');
    console.log('Dept Head: head.se@aastu.edu.et / head123');
    console.log('Student: john.doe@student.aastu.edu.et / student123');
    console.log('Librarian: librarian@aastu.edu.et / librarian123');
    console.log('And other admin accounts...');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();