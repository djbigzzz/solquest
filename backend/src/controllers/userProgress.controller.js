const UserProgress = require('../models/userProgress.model');

/**
 * Get user progress
 * @route GET /api/progress
 * @access Private
 */
const getUserProgress = async (req, res) => {
  try {
    console.log('[PROGRESS] Request user:', req.user.walletAddress);
    
    let userProgress = await UserProgress.findOne({ walletAddress: req.user.walletAddress });
    
    if (!userProgress) {
      console.log('[PROGRESS] Creating new progress for:', req.user.walletAddress);
      userProgress = await UserProgress.create({
        walletAddress: req.user.walletAddress,
        totalPoints: 0
      });
    }
    
    console.log('[PROGRESS] Returning progress for:', req.user.walletAddress);
    res.json(userProgress);
  } catch (error) {
    console.error('[PROGRESS] Error:', error);
    res.status(500).json({ error: true, message: 'Server error' });
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

// Debug endpoint - Test DB connection
const debugDB = async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'OK', dbConnected: true });
  } catch (error) {
    res.status(500).json({ 
      error: true,
      dbConnected: false,
      message: error.message 
    });
  }
};

// Debug endpoint - Test auth middleware
const debugAuth = async (req, res) => {
  res.json({
    authWorking: true,
    user: req.user || null,
    headers: req.headers 
  });
};

// Claim rewards endpoint
const claimQuestRewards = async (req, res) => {
  try {
    console.log('[claimQuestRewards] req.user:', req.user);
    if (!req.user || !req.user.walletAddress) {
      console.error('[claimQuestRewards] Missing req.user or walletAddress');
      return res.status(401).json({ error: true, message: 'Unauthorized: No user/walletAddress' });
    }
    const { walletAddress } = req.user;
    let userProgress = await UserProgress.findOne({ walletAddress });
    console.log('[claimQuestRewards] userProgress:', userProgress);
    if (!userProgress) {
      return res.status(404).json({ error: true, message: 'User progress not found' });
    }
    if (userProgress.rewardsClaimed) {
      return res.status(400).json({ error: true, message: 'Rewards already claimed' });
    }
    userProgress.rewardsClaimed = true;
    userProgress.totalPoints += 150; // Example reward points
    userProgress.lastUpdated = Date.now();
    await userProgress.save();
    res.json({ message: 'Rewards claimed!', totalPoints: userProgress.totalPoints });
  } catch (error) {
    console.error('[claimQuestRewards] ERROR:', error.stack || error);
    res.status(500).json({ error: true, message: 'Server error' });
  }
};

module.exports = {
  getUserProgress,
  updateTwitterQuest,
  updateNFTQuest,
  debugDB,
  debugAuth,
  claimQuestRewards
};
