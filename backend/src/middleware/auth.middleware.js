const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/user.model');

/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
  // FOR TESTING ONLY: Create test user if no token
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    console.log('⚠️ [AUTH] No token - using test account');
    req.user = {
      _id: '000000000000000000000000',
      walletAddress: 'TEST_WALLET_' + Math.random().toString(36).substring(2, 8),
      points: 0,
      isAdmin: false
    };
    return next();
  }

  // Original auth logic
  let token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('[AUTH] User not found for token');
      return res.status(401).json({ error: true, message: 'User not found' });
    }

    user.lastLogin = Date.now();
    await user.save();
    req.user = user;
    console.log(`[AUTH] Authenticated user: ${user.walletAddress}`);
    next();
  } catch (error) {
    console.error('[AUTH] Error:', error.message);
    return res.status(401).json({ error: true, message: 'Not authorized' });
  }
};

/**
 * Middleware to check if user is an admin
 */
// TEMPORARY BYPASS: Allow all authenticated users as admin
const admin = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(403).json({
    error: true,
    message: 'Not authorized as an admin'
  });
};

module.exports = {
  protect,
  admin
};
