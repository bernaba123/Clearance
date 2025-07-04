import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Student Registration Route
router.post('/student/register', [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('studentId').trim().isLength({ min: 1 }).withMessage('Student ID is required'),
  body('college').isIn(['engineering', 'natural_science', 'social_science']).withMessage('Invalid college'),
  body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
  body('yearLevel').isIn(['1', '2', '3', '4', '5']).withMessage('Invalid year level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, studentId, department, college, yearLevel } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Student ID already exists'
      });
    }

    // Create student user
    const userData = {
      fullName,
      email,
      password,
      role: 'student',
      studentId,
      department,
      college,
      yearLevel
    };

    const user = new User(userData);
    await user.save();

    res.status(201).json({ 
      message: 'Student registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Student Login Route
router.post('/student/login', [
  body('email').exists().withMessage('Email or Student ID is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email or student ID
    const user = await User.findOne({ 
      $and: [
        { role: 'student' },
        {
          $or: [
            { email: email },
            { studentId: email }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid student credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Student account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid student credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Student login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        college: user.college,
        yearLevel: user.yearLevel,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Admin Login Route
router.post('/admin/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find admin user (not student)
    const user = await User.findOne({ 
      email: email,
      role: { $ne: 'student' }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Admin account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Admin Registration Route (only accessible by authorized admins)
router.post('/admin/register', authenticate, [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn([
    'system_admin',
    'registrar_admin',
    'department_head',
    'chief_librarian',
    'dormitory_proctor',
    'dining_officer',
    'student_affairs',
    'student_discipline',
    'cost_sharing'
  ]).withMessage('Invalid admin role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, role, department } = req.body;
    const currentUser = req.user;

    // Check permissions
    const canRegisterAdmin = (
      currentUser.role === 'system_admin' ||
      (currentUser.role === 'registrar_admin' && 
       ['registrar_admin', 'department_head'].includes(role))
    );

    if (!canRegisterAdmin) {
      return res.status(403).json({ 
        message: 'You do not have permission to register this type of admin' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create admin user
    const userData = {
      fullName,
      email,
      password,
      role,
      isActive: true,
      mustChangePassword: true // Force password change on first login
    };

    // Add department for department heads
    if (role === 'department_head' && department) {
      userData.department = department;
    }

    // Add college for registrar admins
    if (role === 'registrar_admin' && req.body.college) {
      userData.college = req.body.college;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ 
      message: 'Admin user created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error during admin registration' });
  }
});

// Admin Student Registration Route (only accessible by registrar admins)
router.post('/admin/register-student', authenticate, [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('studentId').trim().isLength({ min: 1 }).withMessage('Student ID is required'),
  body('college').isIn(['engineering', 'natural_science', 'social_science']).withMessage('Invalid college'),
  body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
  body('yearLevel').isIn(['1', '2', '3', '4', '5']).withMessage('Invalid year level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, studentId, department, college, yearLevel, sendEmail } = req.body;
    const currentUser = req.user;

    // Check permissions - only registrar admins can register students
    if (currentUser.role !== 'registrar_admin') {
      return res.status(403).json({ 
        message: 'Only registrar administrators can register students' 
      });
    }

    // Check if registrar admin's college matches the student's college
    if (currentUser.college && currentUser.college !== college) {
      return res.status(403).json({ 
        message: `You can only register students for ${currentUser.college} college` 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Student ID already exists'
      });
    }

    // Create student user
    const userData = {
      fullName,
      email,
      password,
      role: 'student',
      studentId,
      department,
      college,
      yearLevel,
      isActive: true,
      mustChangePassword: true // Force password change on first login
    };

    const user = new User(userData);
    await user.save();

    // TODO: If sendEmail is true, send email with credentials
    // This would require email service configuration

    res.status(201).json({ 
      message: 'Student account created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        college: user.college,
        yearLevel: user.yearLevel
      }
    });
  } catch (error) {
    console.error('Admin student registration error:', error);
    res.status(500).json({ message: 'Server error during student registration' });
  }
});

// Legacy routes for backward compatibility
router.post('/register', [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn([
    'student',
    'department_head',
    'chief_librarian',
    'dormitory_proctor',
    'dining_officer',
    'student_affairs',
    'student_discipline',
    'cost_sharing'
  ]).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, role, studentId, department, college, yearLevel } = req.body;

    // Only allow student registration through legacy route
    if (role !== 'student') {
      return res.status(400).json({ 
        message: 'Admin registration is not allowed through this endpoint. Please contact your administrator.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if student ID already exists (for students)
    if (role === 'student' && studentId) {
      const existingStudent = await User.findOne({ studentId });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student ID already exists' });
      }
    }

    // Create user
    const userData = {
      fullName,
      email,
      password,
      role
    };

    // Add student-specific fields
    if (role === 'student') {
      userData.studentId = studentId;
      userData.department = department;
      userData.college = college;
      userData.yearLevel = yearLevel;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Legacy login route
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        college: user.college,
        yearLevel: user.yearLevel,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;