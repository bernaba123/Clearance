import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

export const isStudent = authorize('student');
export const isAdmin = authorize('system_admin', 'registrar_admin');
export const isDepartmentHead = authorize('department_head');
export const isOtherAdmin = authorize(
  'chief_librarian',
  'dormitory_proctor',
  'dining_officer',
  'student_affairs',
  'student_discipline',
  'cost_sharing'
);
export const isAnyAdmin = authorize(
  'system_admin',
  'registrar_admin',
  'department_head',
  'chief_librarian',
  'dormitory_proctor',
  'dining_officer',
  'student_affairs',
  'student_discipline',
  'cost_sharing'
);