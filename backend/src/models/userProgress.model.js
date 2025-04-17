const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  twitterQuestCompleted: {
    type: Boolean,
    default: false
  }, 
  twitterQuestStarted: {
    type: Boolean,
    default: false
  },
  twitterQuestCompletedAt: {
    type: Date,
    default: null
  },
  nftQuestCompleted: {
    type: Boolean,
    default: false
  },
  nftQuestStarted: {
    type: Boolean,
    default: false
  },
  nftQuestCompletedAt: {
    type: Date,
    default: null
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  rewardsClaimed: {
    type: Boolean,
    default: false
  },
  rewardsClaimedAt: {
    type: Date,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for efficient queries
userProgressSchema.index({ walletAddress: 1 }, { unique: true });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
