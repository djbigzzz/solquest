const mongoose = require('mongoose');
const Quest = require('../models/quest.model');
const QuestProgress = require('../models/questProgress.model');
const connectDB = require('../config/database');

/**
 * Get all quests
 * @route GET /api/quests
 */
const connectDB = require('../config/database');

const getAllQuests = async (req, res) => {
  try {
    await connectDB();
    const quests = await Quest.find({ active: true });
    res.json(quests);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Get quest by ID or slug
 * @route GET /api/quests/:id
 */
const getQuestById = async (req, res) => {
  try {
    await connectDB();
    // Try to find by slug first (for string IDs like 'solana-basics')
    let quest = await Quest.findOne({ slug: req.params.id });
    
    // If not found by slug, try to find by MongoDB ID
    if (!quest && mongoose.Types.ObjectId.isValid(req.params.id)) {
      quest = await Quest.findById(req.params.id);
    }
    
    if (!quest) {
      return res.status(404).json({
        error: true,
        message: 'Quest not found'
      });
    }
    
    res.json(quest);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Create new quest (admin only)
 * @route POST /api/quests
 */
const createQuest = async (req, res) => {
  try {
    await connectDB();
    const {
      title,
      description,
      steps,
      pointsReward,
      nftReward,
      tokenReward,
      difficulty,
      estimatedDuration,
      requirements
    } = req.body;
    
    const quest = await Quest.create({
      title,
      description,
      steps,
      pointsReward,
      nftReward,
      tokenReward,
      difficulty,
      estimatedDuration,
      requirements,
      createdBy: req.user._id
    });
    
    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Update quest (admin only)
 * @route PUT /api/quests/:id
 */
const updateQuest = async (req, res) => {
  try {
    await connectDB();
    // Find quest by slug first, then by ID
    let quest = await Quest.findOne({ slug: req.params.id });
    
    // If not found by slug, try to find by MongoDB ID
    if (!quest && mongoose.Types.ObjectId.isValid(req.params.id)) {
      quest = await Quest.findById(req.params.id);
    }
    
    if (!quest) {
      return res.status(404).json({
        error: true,
        message: 'Quest not found'
      });
    }
    
    const allowedUpdates = [
      'title',
      'description',
      'steps',
      'pointsReward',
      'nftReward',
      'tokenReward',
      'difficulty',
      'estimatedDuration',
      'requirements',
      'active'
    ];
    
    // Update only allowed fields
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        quest[field] = req.body[field];
      }
    }
    
    quest.updatedAt = Date.now();
    const updatedQuest = await quest.save();
    
    res.json(updatedQuest);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Delete quest (admin only)
 * @route DELETE /api/quests/:id
 */
const deleteQuest = async (req, res) => {
  try {
    await connectDB();
    // Find quest by slug first, then by ID
    let quest = await Quest.findOne({ slug: req.params.id });
    
    // If not found by slug, try to find by MongoDB ID
    if (!quest && mongoose.Types.ObjectId.isValid(req.params.id)) {
      quest = await Quest.findById(req.params.id);
    }
    
    if (!quest) {
      return res.status(404).json({
        error: true,
        message: 'Quest not found'
      });
    }
    
    // Soft delete - mark as inactive instead of removing
    quest.active = false;
    await quest.save();
    
    res.json({ message: 'Quest removed' });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Start a quest
 * @route POST /api/quests/:id/start
 */
const startQuest = async (req, res) => {
  try {
    await connectDB();
    // Check if quest exists - try by slug first, then by ID
    let quest = await Quest.findOne({ slug: req.params.id });
    
    // If not found by slug, try to find by MongoDB ID
    if (!quest && mongoose.Types.ObjectId.isValid(req.params.id)) {
      quest = await Quest.findById(req.params.id);
    }
    
    if (!quest) {
      return res.status(404).json({
        error: true,
        message: 'Quest not found'
      });
    }
    
    // Check if user already has this quest in progress
    const existingProgress = await QuestProgress.findOne({
      user: req.user._id,
      quest: quest._id,
      status: { $in: ['in_progress', 'completed'] }
    });
    
    if (existingProgress) {
      return res.status(400).json({
        error: true,
        message: 'Quest already in progress or completed'
      });
    }
    
    // Create quest progress
    const questProgress = await QuestProgress.create({
      user: req.user._id,
      quest: quest._id,
      status: 'in_progress',
      currentStep: 0,
      startedAt: Date.now()
    });
    
    res.status(201).json(questProgress);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Complete a quest
 * @route POST /api/quests/:id/complete
 */
const completeQuest = async (req, res) => {
  try {
    await connectDB();
    // Check if quest exists - try by slug first, then by ID
    let quest = await Quest.findOne({ slug: req.params.id });
    
    // If not found by slug, try to find by MongoDB ID
    if (!quest && mongoose.Types.ObjectId.isValid(req.params.id)) {
      quest = await Quest.findById(req.params.id);
    }
    
    if (!quest) {
      return res.status(404).json({
        error: true,
        message: 'Quest not found'
      });
    }
    
    // Check if user has this quest in progress
    const questProgress = await QuestProgress.findOne({
      user: req.user._id,
      quest: quest._id,
      status: 'in_progress'
    });
    
    if (!questProgress) {
      return res.status(400).json({
        error: true,
        message: 'Quest not in progress'
      });
    }
    
    // Update quest progress
    questProgress.status = 'completed';
    questProgress.completedAt = Date.now();
    await questProgress.save();
    
    // Add points to user
    req.user.points += quest.pointsReward;
    await req.user.save();
    
    res.json({
      message: 'Quest completed successfully',
      pointsEarned: quest.pointsReward,
      totalPoints: req.user.points
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

module.exports = {
  getAllQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  startQuest,
  completeQuest
};
