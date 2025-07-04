import express from 'express';
import Clearance from '../models/Clearance.js';
import { authenticate, isOtherAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats for other admins
router.get('/dashboard-stats', authenticate, isOtherAdmin, async (req, res) => {
  try {
    const allClearances = await Clearance.find()
      .populate('student', 'fullName studentId department');

    const totalApplications = allClearances.length;
    
    const pendingApplications = allClearances.filter(clearance => {
      const myApproval = clearance.approvals.find(a => a.adminType === req.user.role);
      return myApproval?.status === 'pending';
    }).length;
    
    const approvedApplications = allClearances.filter(clearance => {
      const myApproval = clearance.approvals.find(a => a.adminType === req.user.role);
      return myApproval?.status === 'approved';
    }).length;

    const recentApplications = allClearances
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(clearance => {
        const myApproval = clearance.approvals.find(a => a.adminType === req.user.role);
        return {
          ...clearance.toObject(),
          myStatus: myApproval?.status || 'pending'
        };
      });

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      recentApplications
    });
  } catch (error) {
    console.error('Get other admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;