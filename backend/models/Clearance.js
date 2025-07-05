import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema({
  adminType: {
    type: String,
    required: true,
    enum: [
      'chief_librarian',
      'dormitory_proctor',
      'dining_officer',
      'student_affairs',
      'student_discipline',
      'cost_sharing',
      'department_head',
      'registrar_admin'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  reason: String
});

const clearanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isEarlyApplication: {
    type: Boolean,
    default: false
  },
  earlyReason: {
    type: String,
    required: function() {
      return this.isEarlyApplication;
    }
  },
  additionalInfo: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  approvals: [approvalSchema],
  completedAt: Date,
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  // New fields for enhanced dashboard functionality
  officeStatus: {
    type: Map,
    of: String,
    default: {}
  },
  officeRemarks: {
    type: Map,
    of: String,
    default: {}
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  remarks: String,
  reason: String
}, {
  timestamps: true
});

// Initialize approvals array when creating a new clearance
clearanceSchema.pre('save', function(next) {
  if (this.isNew && this.approvals.length === 0) {
    const requiredApprovals = [
      'chief_librarian',
      'dormitory_proctor',
      'dining_officer',
      'student_affairs',
      'student_discipline',
      'cost_sharing',
      'department_head',
      'registrar_admin'
    ];
    
    this.approvals = requiredApprovals.map(adminType => ({
      adminType,
      status: 'pending'
    }));
  }
  next();
});

// Update overall status based on approvals
clearanceSchema.methods.updateStatus = function() {
  const approvals = this.approvals;
  const rejectedApproval = approvals.find(approval => approval.status === 'rejected');
  
  if (rejectedApproval) {
    this.status = 'rejected';
  } else {
    const allApproved = approvals.every(approval => approval.status === 'approved');
    if (allApproved) {
      this.status = 'completed';
      this.completedAt = new Date();
    } else {
      const hasApprovals = approvals.some(approval => approval.status === 'approved');
      this.status = hasApprovals ? 'in_progress' : 'pending';
    }
  }
};

export default mongoose.model('Clearance', clearanceSchema);