const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.utils');
const { verifySignature, generateNonce, createAuthMessage } = require('../utils/solana.utils');

// Store nonces temporarily (in a real app, use Redis or another cache)
const nonceStore = new Map();

/**
 * Generate a nonce for wallet authentication
 * @route GET /api/auth/nonce
 * @access Public
 */
const getNonce = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({
        error: true,
        message: 'Wallet address is required'
      });
    }

    // Generate a new nonce
    const nonce = generateNonce();
    
    // Store the nonce with the wallet address (with 5 minute expiry)
    nonceStore.set(walletAddress, {
      nonce,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    
    // Clean up expired nonces
    for (const [key, value] of nonceStore.entries()) {
      if (value.expires < Date.now()) {
        nonceStore.delete(key);
      }
    }
    
    return res.status(200).json({
      nonce,
      message: createAuthMessage(nonce)
    });
  } catch (error) {
    console.error('Get nonce error:', error);
    return res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

/**
 * Authenticate user with wallet signature
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    
    if (!walletAddress || !signature) {
      return res.status(400).json({
        error: true,
        message: 'Wallet address and signature are required'
      });
    }
    
    // Get stored nonce
    const storedNonce = nonceStore.get(walletAddress);
    
    if (!storedNonce) {
      return res.status(400).json({
        error: true,
        message: 'No nonce found for this wallet. Please request a new nonce.'
      });
    }
    
    if (storedNonce.expires < Date.now()) {
      nonceStore.delete(walletAddress);
      return res.status(400).json({
        error: true,
        message: 'Nonce expired. Please request a new nonce.'
      });
    }
    
    // Verify the signature
    const message = createAuthMessage(storedNonce.nonce);
    const isValid = verifySignature(message, signature, walletAddress);
    
    if (!isValid) {
      return res.status(401).json({
        error: true,
        message: 'Invalid signature'
      });
    }
    
    // Remove the used nonce
    nonceStore.delete(walletAddress);
    
    // Find or create user
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create new user
      user = await User.create({
        walletAddress,
        // Generate username from wallet address
        username: `user_${walletAddress.substring(0, 4)}${walletAddress.substring(walletAddress.length - 4)}`
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        points: user.points,
        referralCode: user.referralCode,
        rewardsEarned: user.rewardsEarned,
        rewardsClaimed: user.rewardsClaimed,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      _id: user._id,
      walletAddress: user.walletAddress,
      username: user.username,
      avatar: user.avatar,
      points: user.points,
      referralCode: user.referralCode,
      rewardsEarned: user.rewardsEarned,
      rewardsClaimed: user.rewardsClaimed,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    
    // Save user
    await user.save();
    
    return res.status(200).json({
      _id: user._id,
      walletAddress: user.walletAddress,
      username: user.username,
      avatar: user.avatar,
      points: user.points,
      referralCode: user.referralCode,
      rewardsEarned: user.rewardsEarned,
      rewardsClaimed: user.rewardsClaimed,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Check for duplicate username error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json({
        error: true,
        message: 'Username already taken'
      });
    }
    
    return res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

module.exports = {
  getNonce,
  login,
  getProfile,
  updateProfile
};
