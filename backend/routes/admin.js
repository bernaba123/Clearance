import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Clearance from '../models/Clearance.js';
import News from '../models/News.js';
import SystemSettings from '../models/SystemSettings.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard-stats', authenticate, isAdmin, async (req, res) => {
  try {
    const [totalUsers, totalApplications, pendingApplications, completedApplications, recentApplications] = await Promise.all([
      User.countDocuments(),
      Clearance.countDocuments(),
      Clearance.countDocuments({ status: { $in: ['pending', 'in_progress'] } }),
      Clearance.countDocuments({ status: 'completed' }),
      Clearance.find()
        .populate('student', 'fullName studentId department')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      totalUsers,
      totalApplications,
      pendingApplications,
      completedApplications,
      recentApplications
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user
router.post('/users', authenticate, isAdmin, [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn([
    'student',
    'system_admin',
    'registrar_admin',
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
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userData = req.body;
    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if student ID already exists (for students)
    if (userData.role === 'student' && userData.studentId) {
      const existingStudent = await User.findOne({ studentId: userData.studentId });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student ID already exists' });
      }
    }

    // Validate required fields based on role
    if (userData.role === 'registrar_admin' && !userData.college) {
      return res.status(400).json({ message: 'College is required for registrar administrators' });
    }

    // Clean up data - remove empty fields that might cause validation issues
    const cleanUserData = { ...userData };
    if (!cleanUserData.college || cleanUserData.college === '') {
      delete cleanUserData.college;
    }
    if (!cleanUserData.department || cleanUserData.department === '') {
      delete cleanUserData.department;
    }
    if (!cleanUserData.studentId || cleanUserData.studentId === '') {
      delete cleanUserData.studentId;
    }
    if (!cleanUserData.yearLevel || cleanUserData.yearLevel === '') {
      delete cleanUserData.yearLevel;
    }

    const user = new User(cleanUserData);
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Create user error:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({ 
      message: 'Server error during user creation',
      error: error.message 
    });
  }
});

// Update user
router.put('/users/:id', authenticate, isAdmin, [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('role').isIn([
    'student',
    'system_admin',
    'registrar_admin',
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

    const userId = req.params.id;
    const updateData = { ...req.body };
    console.log('Updating user with data:', { ...updateData, password: updateData.password ? '[HIDDEN]' : 'Not provided' });

    // Remove password from update if it's empty (don't update password)
    if (!updateData.password || updateData.password.trim() === '') {
      delete updateData.password;
    }

    // Clean up data - remove empty fields that might cause validation issues
    if (!updateData.college || updateData.college === '') {
      delete updateData.college;
    }
    if (!updateData.department || updateData.department === '') {
      delete updateData.department;
    }
    if (!updateData.studentId || updateData.studentId === '') {
      delete updateData.studentId;
    }
    if (!updateData.yearLevel || updateData.yearLevel === '') {
      delete updateData.yearLevel;
    }

    // Validate required fields based on role
    if (updateData.role === 'registrar_admin' && !updateData.college) {
      return res.status(400).json({ message: 'College is required for registrar administrators' });
    }

    // Check if email is being changed and if it already exists
    const existingUser = await User.findOne({ 
      email: updateData.email, 
      _id: { $ne: userId } 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if student ID is being changed and if it already exists (for students)
    if (updateData.role === 'student' && updateData.studentId) {
      const existingStudent = await User.findOne({ 
        studentId: updateData.studentId,
        _id: { $ne: userId }
      });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student ID already exists' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({ 
      message: 'Server error during user update',
      error: error.message 
    });
  }
});

// Update user status
router.patch('/users/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Don't allow deleting own account
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all news
router.get('/news', authenticate, isAdmin, async (req, res) => {
  try {
    const news = await News.find()
      .populate('author', 'fullName role')
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (error) {
    console.error('Get admin news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create news
router.post('/news', authenticate, isAdmin, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category').isIn(['announcement', 'event', 'deadline', 'update']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, category } = req.body;

    const news = new News({
      title,
      content,
      category,
      author: req.user._id
    });

    await news.save();
    await news.populate('author', 'fullName role');

    res.status(201).json({
      message: 'News created successfully',
      news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Server error during news creation' });
  }
});

// Update news
router.put('/news/:id', authenticate, isAdmin, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category').isIn(['announcement', 'event', 'deadline', 'update']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, category } = req.body;
    const newsId = req.params.id;

    const news = await News.findByIdAndUpdate(
      newsId,
      { title, content, category },
      { new: true }
    ).populate('author', 'fullName role');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({
      message: 'News updated successfully',
      news
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete news
router.delete('/news/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const newsId = req.params.id;

    const news = await News.findByIdAndDelete(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// System Admin specific endpoints

// Get system status
router.get('/system-status', authenticate, async (req, res) => {
  try {
    // Only system admins can access system status
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Access denied. System admin required.' });
    }

    const [clearanceSystemActive, registrationActive] = await Promise.all([
      SystemSettings.getSetting('clearanceSystemActive', true),
      SystemSettings.getSetting('registrationActive', true)
    ]);

    res.json({
      clearanceSystemActive,
      registrationActive
    });
  } catch (error) {
    console.error('Get system status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle system status
router.post('/toggle-system', authenticate, async (req, res) => {
  try {
    // Only system admins can toggle system status
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Access denied. System admin required.' });
    }

    const { type } = req.body;
    
    if (!['clearance', 'registration'].includes(type)) {
      return res.status(400).json({ message: 'Invalid system type' });
    }

    // Get current status
    const settingKey = type === 'clearance' ? 'clearanceSystemActive' : 'registrationActive';
    const currentStatus = await SystemSettings.getSetting(settingKey, true);
    
    // Toggle the status
    const newStatus = !currentStatus;
    await SystemSettings.setSetting(
      settingKey, 
      newStatus, 
      req.user._id,
      `${type === 'clearance' ? 'Clearance system' : 'Registration'} ${newStatus ? 'activated' : 'deactivated'} by ${req.user.fullName}`
    );

    // Return all current statuses
    const [clearanceSystemActive, registrationActive] = await Promise.all([
      SystemSettings.getSetting('clearanceSystemActive', true),
      SystemSettings.getSetting('registrationActive', true)
    ]);

    res.json({
      clearanceSystemActive,
      registrationActive
    });
  } catch (error) {
    console.error('Toggle system status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system users (for system admin - excludes students and department heads)
router.get('/system-users', authenticate, async (req, res) => {
  try {
    // Only system admins can access system users
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Access denied. System admin required.' });
    }

    const systemUsers = await User.find({
      role: { 
        $nin: ['student', 'department_head', 'system_admin'] // Exclude students, dept heads, and other system admins
      }
    })
    .select('-password')
    .sort({ createdAt: -1 });

    res.json(systemUsers);
  } catch (error) {
    console.error('Get system users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registrar Admin specific endpoints

// Get registrar dashboard stats
router.get('/registrar/dashboard-stats', authenticate, async (req, res) => {
  try {
    // Only registrar admins can access this
    if (req.user.role !== 'registrar_admin') {
      return res.status(403).json({ message: 'Access denied. Registrar admin required.' });
    }

    const college = req.user.college;
    
    const [totalStudents, totalDepartmentHeads, pendingClearances, completedClearances, recentClearances] = await Promise.all([
      User.countDocuments({ role: 'student', college }),
      User.countDocuments({ role: 'department_head', college }),
      Clearance.countDocuments({ 
        student: { $in: await User.find({ college, role: 'student' }).select('_id') },
        status: 'pending'
      }),
      Clearance.countDocuments({ 
        student: { $in: await User.find({ college, role: 'student' }).select('_id') },
        status: 'completed'
      }),
      Clearance.find({ 
        student: { $in: await User.find({ college, role: 'student' }).select('_id') }
      })
        .populate('student', 'fullName studentId department')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      totalStudents,
      totalDepartmentHeads,
      pendingClearances,
      completedClearances,
      recentClearances
    });
  } catch (error) {
    console.error('Get registrar dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get college clearances
router.get('/registrar/clearances', authenticate, async (req, res) => {
  try {
    // Only registrar admins can access this
    if (req.user.role !== 'registrar_admin') {
      return res.status(403).json({ message: 'Access denied. Registrar admin required.' });
    }

    const college = req.user.college;
    const collegeStudents = await User.find({ college, role: 'student' }).select('_id');
    
    const clearances = await Clearance.find({
      student: { $in: collegeStudents }
    })
    .populate('student', 'fullName studentId department college')
    .sort({ createdAt: -1 });

    res.json(clearances);
  } catch (error) {
    console.error('Get college clearances error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject clearance by registrar
router.post('/registrar/clearance/:id/:action', authenticate, async (req, res) => {
  try {
    // Only registrar admins can access this
    if (req.user.role !== 'registrar_admin') {
      return res.status(403).json({ message: 'Access denied. Registrar admin required.' });
    }

    const { id, action } = req.params;
    const { remarks } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const clearance = await Clearance.findById(id).populate('student');
    if (!clearance) {
      return res.status(404).json({ message: 'Clearance not found' });
    }

    // Check if the student belongs to the registrar's college
    if (clearance.student.college !== req.user.college) {
      return res.status(403).json({ message: 'You can only manage clearances for your college' });
    }

    // Update clearance status
    clearance.status = action === 'approve' ? 'approved' : 'rejected';
    if (remarks) {
      clearance.remarks = remarks;
    }
    clearance.processedBy = req.user._id;
    clearance.processedAt = new Date();

    await clearance.save();

    res.json({ message: `Clearance ${action}d successfully` });
  } catch (error) {
    console.error(`${req.params.action} clearance error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Other Admin specific endpoints

// Get other admin dashboard stats
router.get('/other-admin/dashboard-stats', authenticate, async (req, res) => {
  try {
    // Only other admin roles can access this
    const otherAdminRoles = ['chief_librarian', 'dormitory_proctor', 'dining_officer', 'student_affairs', 'student_discipline', 'cost_sharing'];
    if (!otherAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const userRole = req.user.role;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pendingApprovals, approvedToday, rejectedToday, totalProcessed] = await Promise.all([
      Clearance.countDocuments({ 
        [`officeStatus.${userRole}`]: { $in: [null, 'pending'] }
      }),
      Clearance.countDocuments({ 
        [`officeStatus.${userRole}`]: 'approved',
        processedAt: { $gte: today }
      }),
      Clearance.countDocuments({ 
        [`officeStatus.${userRole}`]: 'rejected',
        processedAt: { $gte: today }
      }),
      Clearance.countDocuments({ 
        [`officeStatus.${userRole}`]: { $in: ['approved', 'rejected'] }
      })
    ]);

    res.json({
      pendingApprovals,
      approvedToday,
      rejectedToday,
      totalProcessed
    });
  } catch (error) {
    console.error('Get other admin dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get clearance requests for other admin
router.get('/other-admin/clearance-requests', authenticate, async (req, res) => {
  try {
    // Only other admin roles can access this
    const otherAdminRoles = ['chief_librarian', 'dormitory_proctor', 'dining_officer', 'student_affairs', 'student_discipline', 'cost_sharing'];
    if (!otherAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const clearanceRequests = await Clearance.find()
      .populate('student', 'fullName studentId department college')
      .sort({ createdAt: -1 });

    res.json(clearanceRequests);
  } catch (error) {
    console.error('Get clearance requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject clearance by other admin
router.post('/other-admin/clearance/:id/:action', authenticate, async (req, res) => {
  try {
    // Only other admin roles can access this
    const otherAdminRoles = ['chief_librarian', 'dormitory_proctor', 'dining_officer', 'student_affairs', 'student_discipline', 'cost_sharing'];
    if (!otherAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { id, action } = req.params;
    const { remarks } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ message: 'Clearance not found' });
    }

    // Update office status for this admin
    if (!clearance.officeStatus) {
      clearance.officeStatus = {};
    }
    clearance.officeStatus[req.user.role] = action === 'approve' ? 'approved' : 'rejected';
    
    if (remarks) {
      if (!clearance.officeRemarks) {
        clearance.officeRemarks = {};
      }
      clearance.officeRemarks[req.user.role] = remarks;
    }

    clearance.processedAt = new Date();
    await clearance.save();

    res.json({ message: `Clearance ${action}d successfully` });
  } catch (error) {
    console.error(`${req.params.action} clearance error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;