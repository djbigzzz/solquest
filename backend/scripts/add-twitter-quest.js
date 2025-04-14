/**
 * Script to add a simple Twitter follow quest to the database
 */
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define Quest schema (simplified version of the actual model)
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
  tasks: [{
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
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  participants: {
    type: Number,
    default: 0
  },
  completions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Quest = mongoose.model('Quest', questSchema);

// Create SolQuest project quests
const createSolQuestQuests = async () => {
  try {
    // Clear existing quests
    await Quest.deleteMany({});
    console.log('Cleared existing quests');
    
    // Create Twitter follow quest
    const twitterQuest = new Quest({
      title: 'Follow SolQuest on Twitter',
      slug: 'follow-solquest-twitter',
      description: 'Follow SolQuest on Twitter to stay updated with the latest news and announcements about our platform and ecosystem.',
      shortDescription: 'Follow SolQuest on Twitter for the latest updates',
      imageUrl: 'https://solquest.io/images/twitter-quest.png',
      bannerUrl: 'https://solquest.io/images/twitter-banner.png',
      category: 'beginner',
      difficulty: 1,
      projectName: 'SolQuest',
      rewards: {
        points: 100,
        sol: 0,
        nft: false
      },
      tasks: [
        {
          id: 'follow-twitter',
          title: 'Follow @SolQuestIO on Twitter',
          description: 'Click the button below to follow SolQuest on Twitter',
          type: 'social',
          points: 100,
          validation: {
            platform: 'twitter',
            action: 'follow',
            target: 'SolQuestIO'
          }
        }
      ],
      isActive: true
    });
    
    await twitterQuest.save();
    console.log('Twitter quest created successfully!');
    
    // Create NFT mint quest
    const nftQuest = new Quest({
      title: 'Mint SolQuest OG NFT',
      slug: 'mint-solquest-og-nft',
      description: 'Mint the exclusive SolQuest OG NFT. Only 10,000 will ever be minted, making this a rare collectible in the Solana ecosystem.',
      shortDescription: 'Mint the exclusive SolQuest OG NFT',
      imageUrl: 'https://solquest.io/images/nft-quest.png',
      bannerUrl: 'https://solquest.io/images/nft-banner.png',
      category: 'beginner',
      difficulty: 2,
      projectName: 'SolQuest',
      rewards: {
        points: 400,
        sol: 0,
        nft: true,
        nftDetails: {
          name: 'SolQuest OG',
          description: 'Exclusive SolQuest OG NFT',
          image: 'https://solquest.io/images/solquest-og-nft.png',
          attributes: [
            {
              trait_type: 'Collection',
              value: 'SolQuest OG'
            },
            {
              trait_type: 'Rarity',
              value: 'Rare'
            }
          ]
        }
      },
      tasks: [
        {
          id: 'mint-nft',
          title: 'Mint SolQuest OG NFT',
          description: 'Click the button below to mint your SolQuest OG NFT',
          type: 'transaction',
          points: 400,
          validation: {
            type: 'nft_mint',
            collection: 'SolQuest OG'
          }
        }
      ],
      isActive: true
    });
    
    await nftQuest.save();
    console.log('NFT mint quest created successfully!');
  } catch (error) {
    console.error('Error creating SolQuest quests:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createSolQuestQuests();
  console.log('Done!');
  process.exit(0);
};

main();
