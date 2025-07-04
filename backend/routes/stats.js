import express from 'express';
import User from '../models/User.js';
import Clearance from '../models/Clearance.js';

const router = express.Router();

// Get public statistics
router.get('/public', async (req, res) => {
  try {
    const [totalStudents, pendingClearances, completedClearances, activeAdmins] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      Clearance.countDocuments({ status: { $in: ['pending', 'in_progress'] } }),
      Clearance.countDocuments({ status: 'completed' }),
      User.countDocuments({ 
        role: { $ne: 'student' }, 
        isActive: true 
      })
    ]);

    res.json({
      totalStudents,
      pendingClearances,
      completedClearances,
      activeAdmins
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;