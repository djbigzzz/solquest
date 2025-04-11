const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  proof: {
    type: String,
    default: ''
  }
}, {
  _id: false
});

const questProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  progress: [taskProgressSchema],
  isCompleted: {
    type: Boolean,
    default: false
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  },
  rewardClaimedAt: {
    type: Date,
    default: null
  },
  rewardTxId: {
    type: String,
    default: null
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

// Create a compound index for efficient querying
questProgressSchema.index({ userId: 1, questId: 1 }, { unique: true });
questProgressSchema.index({ questId: 1, isCompleted: 1 });
questProgressSchema.index({ userId: 1, isCompleted: 1 });

const QuestProgress = mongoose.model('QuestProgress', questProgressSchema);

module.exports = QuestProgress;
