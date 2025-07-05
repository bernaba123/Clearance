import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: [
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
    ]
  },
  // Student-specific fields
  studentId: {
    type: String,
    sparse: true,
    unique: true
  },
  department: {
    type: String,
    required: function() {
      return this.role === 'student' || this.role === 'department_head';
    }
  },
  college: {
    type: String,
    required: function() {
      return this.role === 'student' || this.role === 'registrar_admin';
    },
    enum: ['engineering', 'natural_sciences', 'social_sciences']
  },
  yearLevel: {
    type: Number,
    required: function() {
      return this.role === 'student';
    },
    min: 1,
    max: 5
  },
  // Admin-specific fields
  phone: String,
  office: String,
  bio: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);