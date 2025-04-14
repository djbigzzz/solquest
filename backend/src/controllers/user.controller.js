const User = require('../models/user.model');

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Check permissions - only allow users to update their own profile or admin
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({
        error: true,
        message: 'Not authorized to update this user'
      });
    }
    
    // Fields that can be updated
    const allowedUpdates = ['username', 'email', 'profileImage'];
    
    // Update only allowed fields
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }
    
    // Save user
    const updatedUser = await user.save();
    
    // Return user without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser
};
