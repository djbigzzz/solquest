const UserProgress = require('../models/userProgress.model');

/**
 * Get user progress
 * @route GET /api/progress
 * @access Private
 */
const getUserProgress = async (req, res) => {
  try {
    const { walletAddress } = req.user;
    
    // Find or create user progress
    let userProgress = await UserProgress.findOne({ walletAddress });
    
    if (!userProgress) {
      // Create new progress record if none exists
      userProgress = await UserProgress.create({
        walletAddress,
        totalPoints: 0
      });
    }
    
    res.json(userProgress);
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

/**
 * Update Twitter quest progress
 * @route POST /api/progress/twitter
 * @access Private
 */
const updateTwitterQuest = async (req, res) => {
  try {
    const { walletAddress } = req.user;
    const { started, completed } = req.body;
    
    // Find or create user progress
    let userProgress = await UserProgress.findOne({ walletAddress });
    
    if (!userProgress) {
      userProgress = new UserProgress({ walletAddress });
    }
    
    // Update progress
    if (started !== undefined) {
      userProgress.twitterQuestStarted = started;
    }
    
    if (completed !== undefined && completed && !userProgress.twitterQuestCompleted) {
      userProgress.twitterQuestCompleted = true;
      userProgress.twitterQuestCompletedAt = Date.now();
      userProgress.totalPoints += 100; // Twitter quest is worth 100 points
    }
    
    userProgress.lastUpdated = Date.now();
    await userProgress.save();
    
    res.json(userProgress);
  } catch (error) {
    console.error('Update Twitter quest error:', error);
    res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

/**
 * Update NFT quest progress
 * @route POST /api/progress/nft
 * @access Private
 */
const updateNFTQuest = async (req, res) => {
  try {
    const { walletAddress } = req.user;
    const { started, completed, mintProgress } = req.body;
    
    // Find or create user progress
    let userProgress = await UserProgress.findOne({ walletAddress });
    
    if (!userProgress) {
      userProgress = new UserProgress({ walletAddress });
    }
    
    // Update progress
    if (started !== undefined) {
      userProgress.nftQuestStarted = started;
    }
    
    if (completed !== undefined && completed && !userProgress.nftQuestCompleted) {
      userProgress.nftQuestCompleted = true;
      userProgress.nftQuestCompletedAt = Date.now();
      userProgress.totalPoints += 400; // NFT quest is worth 400 points
    }
    
    userProgress.lastUpdated = Date.now();
    await userProgress.save();
    
    res.json(userProgress);
  } catch (error) {
    console.error('Update NFT quest error:', error);
    res.status(500).json({
      error: true,
      message: 'Server error'
    });
  }
};

module.exports = {
  getUserProgress,
  updateTwitterQuest,
  updateNFTQuest
};
