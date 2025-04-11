const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['wallet', 'transaction', 'social', 'quiz', 'manual', 'custom'],
    required: true
  },
  points: {
    type: Number,
    default: 10
  },
  validation: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  _id: false
});

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  bannerUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'partner', 'special'],
    default: 'beginner'
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  rewards: {
    points: {
      type: Number,
      required: true,
      default: 100
    },
    sol: {
      type: Number,
      default: 0
    },
    nft: {
      type: Boolean,
      default: false
    },
    nftDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  tasks: [taskSchema],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  participants: {
    type: Number,
    default: 0
  },
  completions: {
    type: Number,
    default: 0
  },
  partnerName: {
    type: String,
    default: ''
  },
  partnerLogo: {
    type: String,
    default: ''
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
questSchema.index({ slug: 1 });
questSchema.index({ category: 1 });
questSchema.index({ isActive: 1, startDate: -1 });
questSchema.index({ isPromoted: 1 });

const Quest = mongoose.model('Quest', questSchema);

module.exports = Quest;
