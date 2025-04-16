const express = require('express');
const router = express.Router();
const { admin, protect } = require('../middleware/auth.middleware');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Quest = require('../models/quest.model');
const QuestProgress = require('../models/questProgress.model');

// GET /api/admin/dashboard - Admin dashboard summary
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const questCount = await Quest.countDocuments();
    const completions = await QuestProgress.countDocuments({ status: 'completed' });
    const recentCompletions = await QuestProgress.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate('user', 'walletAddress')
      .populate('quest', 'title');
    res.json({
      userCount,
      questCount,
      completions,
      recentCompletions
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;
