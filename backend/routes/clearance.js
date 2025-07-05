import express from 'express';
import { body, validationResult } from 'express-validator';
import Clearance from '../models/Clearance.js';
import User from '../models/User.js';
import { authenticate, isStudent, isAnyAdmin } from '../middleware/auth.js';
import { checkClearanceSystemStatus } from '../middleware/systemStatus.js';
import jsPDF from 'jspdf';

const router = express.Router();

// Apply for clearance (Students only)
router.post('/apply', authenticate, isStudent, checkClearanceSystemStatus, [
  body('isEarlyApplication').isBoolean().withMessage('isEarlyApplication must be boolean'),
  body('earlyReason').optional().trim(),
  body('additionalInfo').optional().trim(),
  body('agreeToTerms').equals('true').withMessage('You must agree to terms and conditions')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isEarlyApplication, earlyReason, additionalInfo } = req.body;

    // Check if student already has a pending or active clearance
    const existingClearance = await Clearance.findOne({
      student: req.user._id,
      status: { $in: ['pending', 'in_progress'] }
    });

    if (existingClearance) {
      return res.status(400).json({ 
        message: 'You already have an active clearance application' 
      });
    }

    // Validate early application reason
    if (isEarlyApplication && !earlyReason) {
      return res.status(400).json({ 
        message: 'Reason is required for early clearance applications' 
      });
    }

    // Create clearance application
    const clearance = new Clearance({
      student: req.user._id,
      isEarlyApplication,
      earlyReason: isEarlyApplication ? earlyReason : undefined,
      additionalInfo
    });

    await clearance.save();
    await clearance.populate('student', 'fullName studentId department yearLevel');

    res.status(201).json({
      message: 'Clearance application submitted successfully',
      clearance
    });
  } catch (error) {
    console.error('Apply clearance error:', error);
    res.status(500).json({ message: 'Server error during application submission' });
  }
});

// Get clearance status (Students only)
router.get('/status', authenticate, isStudent, checkClearanceSystemStatus, async (req, res) => {
  try {
    const clearance = await Clearance.findOne({ 
      student: req.user._id 
    })
    .populate('student', 'fullName studentId department yearLevel')
    .populate('approvals.approvedBy', 'fullName role')
    .sort({ createdAt: -1 });

    if (!clearance) {
      return res.status(404).json({ message: 'No clearance application found' });
    }

    res.json(clearance);
  } catch (error) {
    console.error('Get clearance status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Review clearance (Admins only)
router.post('/:id/review', authenticate, isAnyAdmin, [
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

    // Find clearance
    const clearance = await Clearance.findById(clearanceId)
      .populate('student', 'fullName studentId department');

    if (!clearance) {
      return res.status(404).json({ message: 'Clearance application not found' });
    }

    // Find the approval for this admin type
    const approvalIndex = clearance.approvals.findIndex(
      approval => approval.adminType === req.user.role
    );

    if (approvalIndex === -1) {
      return res.status(403).json({ 
        message: 'You are not authorized to review this clearance' 
      });
    }

    // Check if already reviewed
    if (clearance.approvals[approvalIndex].status !== 'pending') {
      return res.status(400).json({ 
        message: 'This clearance has already been reviewed by you' 
      });
    }

    // For department heads, check if student belongs to their department
    if (req.user.role === 'department_head') {
      if (clearance.student.department !== req.user.department) {
        return res.status(403).json({ 
          message: 'You can only review clearances for your department' 
        });
      }
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
      message: `Clearance ${status} successfully`,
      clearance
    });
  } catch (error) {
    console.error('Review clearance error:', error);
    res.status(500).json({ message: 'Server error during review' });
  }
});

// Generate and download clearance certificate
router.get('/certificate', authenticate, isStudent, checkClearanceSystemStatus, async (req, res) => {
  try {
    const clearance = await Clearance.findOne({ 
      student: req.user._id,
      status: 'completed'
    }).populate('student', 'fullName studentId department yearLevel');

    if (!clearance) {
      return res.status(404).json({ 
        message: 'No completed clearance found or clearance not yet approved' 
      });
    }

    // Generate PDF certificate
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('ADDIS ABABA SCIENCE AND TECHNOLOGY UNIVERSITY', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('STUDENT CLEARANCE CERTIFICATE', 105, 50, { align: 'center' });
    
    // Student information
    doc.setFontSize(12);
    doc.text('This is to certify that:', 20, 80);
    
    doc.setFontSize(14);
    doc.text(`Name: ${clearance.student.fullName}`, 20, 100);
    doc.text(`Student ID: ${clearance.student.studentId}`, 20, 120);
    doc.text(`Department: ${clearance.student.department}`, 20, 140);
    doc.text(`Year Level: ${clearance.student.yearLevel}${clearance.student.yearLevel === 1 ? 'st' : clearance.student.yearLevel === 2 ? 'nd' : clearance.student.yearLevel === 3 ? 'rd' : 'th'} Year`, 20, 160);
    
    doc.setFontSize(12);
    doc.text('Has successfully completed all clearance requirements and is cleared', 20, 190);
    doc.text('from all university obligations.', 20, 205);
    
    // Date and signature
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 240);
    doc.text('Registrar Office', 140, 260);
    doc.text('_____________________', 140, 275);
    doc.text('Authorized Signature', 140, 285);

    // Mark certificate as generated
    clearance.certificateGenerated = true;
    await clearance.save();

    // Send PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=clearance-certificate.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error during certificate generation' });
  }
});

export default router;