import SystemSettings from '../models/SystemSettings.js';

export const checkClearanceSystemStatus = async (req, res, next) => {
  try {
    // Only check for students and clearance-related operations
    if (req.user && req.user.role === 'student') {
      const clearanceSystemActive = await SystemSettings.getSetting('clearanceSystemActive', true);
      
      if (!clearanceSystemActive) {
        return res.status(503).json({ 
          message: 'The clearance system is currently deactivated. Please contact the administration for more information.',
          systemDeactivated: true
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('System status check error:', error);
    // If there's an error checking status, allow access (fail open)
    next();
  }
};

export const checkRegistrationSystemStatus = async (req, res, next) => {
  try {
    const registrationActive = await SystemSettings.getSetting('registrationActive', true);
    
    if (!registrationActive) {
      return res.status(503).json({ 
        message: 'User registration is currently disabled. Please contact the administration for more information.',
        registrationDisabled: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Registration status check error:', error);
    // If there's an error checking status, allow access (fail open)
    next();
  }
};

export const getSystemStatus = async () => {
  try {
    const [clearanceSystemActive, registrationActive] = await Promise.all([
      SystemSettings.getSetting('clearanceSystemActive', true),
      SystemSettings.getSetting('registrationActive', true)
    ]);
    
    return {
      clearanceSystemActive,
      registrationActive
    };
  } catch (error) {
    console.error('Get system status error:', error);
    return {
      clearanceSystemActive: true,
      registrationActive: true
    };
  }
};