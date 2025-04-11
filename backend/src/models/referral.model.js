const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    index: true
  },
  convertedAt: {
    type: Date,
    default: Date.now
  },
  questsCompleted: {
    type: Number,
    default: 0
  },
  rewardsEarned: {
    type: Number,
    default: 0
  },
  rewardsClaimed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'rewarded', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Create indexes for efficient querying
referralSchema.index({ referrerId: 1, referredId: 1 }, { unique: true });
referralSchema.index({ code: 1, referredId: 1 }, { unique: true });

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
