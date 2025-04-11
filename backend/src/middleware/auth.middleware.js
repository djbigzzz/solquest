const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/user.model');

/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      // Find user by id and exclude password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'User not found'
        });
      }

      // Update last login time
      user.lastLogin = Date.now();
      await user.save();

      // Set user in request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        error: true,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Not authorized, no token'
    });
  }
};

/**
 * Middleware to check if user is an admin
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      error: true,
      message: 'Not authorized as an admin'
    });
  }
};

module.exports = {
  protect,
  admin
};
