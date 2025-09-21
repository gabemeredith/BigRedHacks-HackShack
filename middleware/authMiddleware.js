const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password').populate('business');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware (can be used for admin-only routes)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Business owner middleware - ensure user can only access their own business
const businessOwner = async (req, res, next) => {
  try {
    // If businessId is in params, verify user owns this business
    if (req.params.businessId && req.user.business) {
      if (req.user.business._id.toString() !== req.params.businessId) {
        return res.status(403).json({ message: 'Not authorized to access this business' });
      }
    }
    
    // If no business associated with user
    if (!req.user.business) {
      return res.status(403).json({ message: 'No business associated with this account' });
    }

    next();
  } catch (error) {
    console.error('Business owner verification error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

module.exports = { protect, admin, businessOwner };
