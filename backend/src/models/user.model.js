const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 0
  },
  completedQuests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rewardsEarned: {
    type: Number,
    default: 0
  },
  rewardsClaimed: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  pointsHistory: [
    {
      subtaskId: { type: String },
      questId: { type: String },
      type: { type: String }, // e.g. "twitter", "discord", etc.
      description: { type: String },
      points: { type: Number },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Create a compound index for efficient leaderboard queries
userSchema.index({ points: -1, createdAt: 1 });

// Generate a unique referral code for new users
userSchema.pre('save', async function(next) {
  if (!this.referralCode && this.walletAddress) {
    // Generate a referral code based on wallet address
    // Take first 4 and last 4 characters of the wallet address
    const prefix = this.walletAddress.substring(0, 4);
    const suffix = this.walletAddress.substring(this.walletAddress.length - 4);
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.referralCode = `${prefix}${randomPart}${suffix}`.toUpperCase();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
