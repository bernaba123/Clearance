import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Clearance from '../models/Clearance.js';
import News from '../models/News.js';
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
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userData = req.body;

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

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error during user creation' });
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

export default router;