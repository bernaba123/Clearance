import express from 'express';
import { body, validationResult } from 'express-validator';
import Clearance from '../models/Clearance.js';
import { authenticate, isDepartmentHead } from '../middleware/auth.js';

const router = express.Router();

// Get department dashboard stats
router.get('/dashboard-stats', authenticate, isDepartmentHead, async (req, res) => {
  try {
    // Get clearances for students in this department
    const departmentClearances = await Clearance.find()
      .populate('student', 'department')
      .then(clearances => clearances.filter(c => c.student?.department === req.user.department));

    const totalApplications = departmentClearances.length;
    const pendingApplications = departmentClearances.filter(c => {
      const deptApproval = c.approvals.find(a => a.adminType === 'department_head');
      return deptApproval?.status === 'pending';
    }).length;
    
    const approvedApplications = departmentClearances.filter(c => {
      const deptApproval = c.approvals.find(a => a.adminType === 'department_head');
      return deptApproval?.status === 'approved';
    }).length;
    
    const rejectedApplications = departmentClearances.filter(c => {
      const deptApproval = c.approvals.find(a => a.adminType === 'department_head');
      return deptApproval?.status === 'rejected';
    }).length;

    const recentApplications = departmentClearances
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(clearance => {
        const deptApproval = clearance.approvals.find(a => a.adminType === 'department_head');
        return {
          ...clearance.toObject(),
          departmentStatus: deptApproval?.status || 'pending'
        };
      });

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      recentApplications
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for department review
router.get('/applications', authenticate, isDepartmentHead, async (req, res) => {
  try {
    const clearances = await Clearance.find()
      .populate('student', 'fullName studentId department yearLevel')
      .populate('approvals.approvedBy', 'fullName')
      .sort({ createdAt: -1 });

    // Filter for this department and add department status
    const departmentApplications = clearances
      .filter(clearance => clearance.student?.department === req.user.department)
      .map(clearance => {
        const deptApproval = clearance.approvals.find(a => a.adminType === 'department_head');
        return {
          ...clearance.toObject(),
          departmentStatus: deptApproval?.status || 'pending'
        };
      });

    res.json(departmentApplications);
  } catch (error) {
    console.error('Get department applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Review application
router.post('/applications/:id/review', authenticate, isDepartmentHead, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, reason } = req.body;
    const clearanceId = req.params.id;

    const clearance = await Clearance.findById(clearanceId)
      .populate('student', 'fullName studentId department');

    if (!clearance) {
      return res.status(404).json({ message: 'Clearance application not found' });
    }

    // Check if student belongs to this department
    if (clearance.student.department !== req.user.department) {
      return res.status(403).json({ 
        message: 'You can only review clearances for your department' 
      });
    }

    // Find department head approval
    const approvalIndex = clearance.approvals.findIndex(
      approval => approval.adminType === 'department_head'
    );

    if (approvalIndex === -1) {
      return res.status(500).json({ message: 'Department approval not found' });
    }

    // Check if already reviewed
    if (clearance.approvals[approvalIndex].status !== 'pending') {
      return res.status(400).json({ 
        message: 'This clearance has already been reviewed' 
      });
    }

    // Update approval
    clearance.approvals[approvalIndex].status = status;
    clearance.approvals[approvalIndex].approvedBy = req.user._id;
    clearance.approvals[approvalIndex].approvedAt = new Date();
    if (reason) {
      clearance.approvals[approvalIndex].reason = reason;
    }

    // Update overall clearance status
    clearance.updateStatus();

    await clearance.save();

    res.json({
      message: `Application ${status} successfully`,
      clearance
    });
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({ message: 'Server error during review' });
  }
});

export default router;