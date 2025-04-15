const User = require('../models/user.model');

/**
 * Validate a social subtask (Twitter, Discord, etc.)
 * @route POST /api/progress/social
 * @body { questId, subtaskId, type, description, points }
 */
exports.validateSocialSubtask = async (req, res) => {
  try {
    const { questId, subtaskId, type, description, points } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    // Check if this subtask is already completed (by history)
    const alreadyCompleted = user.pointsHistory.some(
      (entry) => entry.subtaskId === subtaskId && entry.questId === questId
    );
    if (alreadyCompleted) {
      return res.status(400).json({ error: true, message: 'Subtask already validated' });
    }

    // Award points and add to history
    user.points += points;
    user.pointsHistory.push({
      subtaskId,
      questId,
      type,
      description,
      points,
      timestamp: new Date()
    });
    await user.save();

    return res.json({
      success: true,
      points: user.points,
      pointsHistory: user.pointsHistory
    });
  } catch (error) {
    console.error('Error validating social subtask:', error);
    return res.status(500).json({ error: true, message: error.message });
  }
};
