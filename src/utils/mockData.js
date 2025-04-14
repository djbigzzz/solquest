/**
 * Mock data for the SolQuest application
 * Used when the backend API is unavailable
 */

// Import quest images for fallback
import solanaBasicsImg from '../assets/images/solana-basics.svg';
import solquestProjectImg from '../assets/images/solquest-project.svg';
import defiExplorerImg from '../assets/images/defi-explorer.svg';
import nftCreationImg from '../assets/images/nft-creation.svg';
import stakingBasicsImg from '../assets/images/staking-basics.svg';

// Import partner logos for fallback
import phantomLogo from '../assets/images/partners/phantom.svg';
import solflareLogo from '../assets/images/partners/solflare.svg';
import magicedenLogo from '../assets/images/partners/magiceden.svg';
import orcaLogo from '../assets/images/partners/orca.svg';
import marinadeLogo from '../assets/images/partners/marinade.svg';

// Mock quests data
export const questsData = [
  {
    id: 'solana-basics',
    title: 'Solana Basics',
    description: 'Get started with Solana by learning the fundamentals and earning your first rewards',
    reward: '0.5 SOL',
    image: solanaBasicsImg,
    category: 'Education',
    xp: 250,
    partner: {
      name: 'Phantom',
      logo: phantomLogo,
      website: 'https://phantom.app'
    },
    featured: false,
    completed: false,
    progress: 0
  },
  {
    id: 'solquest-project',
    title: 'SolQuest Project',
    description: 'Join the SolQuest community, follow our socials, and earn exclusive NFT rewards',
    reward: '0.75 SOL + Exclusive NFT',
    xp: 350,
    image: solquestProjectImg,
    category: 'Community',
    featured: true,
    partner: {
      name: 'SolQuest',
      logo: solquestProjectImg,
      website: 'https://solquest.io'
    },
    completed: false,
    progress: 0
  },
  {
    id: 'defi-explorer',
    title: 'DeFi Explorer',
    description: 'Learn about DeFi protocols on Solana and complete swaps',
    reward: '0.5 SOL',
    xp: 200,
    image: defiExplorerImg,
    category: 'DeFi',
    partner: {
      name: 'Orca',
      logo: orcaLogo,
      website: 'https://www.orca.so'
    },
    featured: false,
    completed: false,
    progress: 0
  },
  {
    id: 'nft-creation',
    title: 'NFT Creation',
    description: 'Create and mint your first NFT on Solana',
    reward: '0.8 SOL',
    xp: 300,
    image: nftCreationImg,
    category: 'NFT',
    partner: {
      name: 'Magic Eden',
      logo: magicedenLogo,
      website: 'https://magiceden.io'
    },
    featured: false,
    completed: false,
    progress: 0
  },
  {
    id: 'staking-basics',
    title: 'Staking Basics',
    description: 'Learn how to stake SOL and earn passive rewards',
    reward: '0.3 SOL',
    xp: 150,
    image: stakingBasicsImg,
    category: 'Staking',
    partner: {
      name: 'Marinade',
      logo: marinadeLogo,
      website: 'https://marinade.finance'
    },
    featured: false,
    completed: false,
    progress: 0
  }
];

// Mock quest details data
export const questDetailsData = {
  'solana-basics': {
    id: 'solana-basics',
    title: 'Solana Basics',
    description: 'Get started with Solana by learning the fundamentals and earning your first rewards',
    reward: '0.5 SOL',
    image: solanaBasicsImg,
    category: 'Education',
    xp: 250,
    partner: {
      name: 'Phantom',
      logo: phantomLogo,
      website: 'https://phantom.app'
    },
    subtasks: [
      {
        id: 'solana-basics-1',
        title: 'Create a Solana wallet',
        description: 'Set up a Phantom or Solflare wallet and secure your recovery phrase',
        xp: 50,
        completed: false
      },
      {
        id: 'solana-basics-2',
        title: 'Get test SOL from faucet',
        description: 'Visit the Solana devnet faucet and request test SOL tokens',
        xp: 50,
        completed: false
      },
      {
        id: 'solana-basics-3',
        title: 'Send your first transaction',
        description: 'Send a small amount of SOL to another wallet address',
        xp: 75,
        completed: false
      },
      {
        id: 'solana-basics-4',
        title: 'Explore the Solana ecosystem',
        description: 'Visit the Solana dApp store and explore at least 3 applications',
        xp: 75,
        completed: false
      }
    ]
  },
  'solquest-project': {
    id: 'solquest-project',
    title: 'SolQuest Project',
    description: 'Join the SolQuest community, follow our socials, and earn exclusive NFT rewards',
    reward: '0.75 SOL + Exclusive NFT',
    xp: 350,
    image: solquestProjectImg,
    category: 'Community',
    featured: true,
    partner: {
      name: 'SolQuest',
      logo: solquestProjectImg,
      website: 'https://solquest.io'
    },
    subtasks: [
      {
        id: 'solquest-project-1',
        title: 'Follow SolQuest on Twitter',
        description: 'Follow our official Twitter account @SolQuestProject',
        xp: 50,
        completed: false,
        socialLink: 'https://twitter.com'
      },
      {
        id: 'solquest-project-2',
        title: 'Join our Discord community',
        description: 'Join the SolQuest Discord server and introduce yourself',
        xp: 75,
        completed: false,
        socialLink: 'https://discord.com'
      },
      {
        id: 'solquest-project-3',
        title: 'Share SolQuest with your network',
        description: 'Post about SolQuest on your social media and tag us',
        xp: 100,
        completed: false
      },
      {
        id: 'solquest-project-4',
        title: 'Purchase the SolQuest Starter NFT',
        description: 'Buy our exclusive NFT that provides bonus rewards for all quests',
        xp: 125,
        completed: false,
        nftLink: 'https://magiceden.io'
      }
    ]
  },
  'defi-explorer': {
    id: 'defi-explorer',
    title: 'DeFi Explorer',
    description: 'Learn about DeFi protocols on Solana and complete swaps',
    reward: '0.5 SOL',
    xp: 200,
    image: defiExplorerImg,
    category: 'DeFi',
    partner: {
      name: 'Orca',
      logo: orcaLogo,
      website: 'https://www.orca.so'
    },
    subtasks: [
      {
        id: 'defi-explorer-1',
        title: 'Create a Solana wallet',
        description: 'Set up a Phantom or Solflare wallet',
        xp: 50,
        completed: false
      },
      {
        id: 'defi-explorer-2',
        title: 'Fund your wallet',
        description: 'Add SOL to your wallet using a faucet or exchange',
        xp: 50,
        completed: false
      },
      {
        id: 'defi-explorer-3',
        title: 'Explore Jupiter Aggregator',
        description: 'Visit Jupiter and explore available tokens',
        xp: 50,
        completed: false
      },
      {
        id: 'defi-explorer-4',
        title: 'Complete a token swap',
        description: 'Swap a small amount of SOL for another token',
        xp: 50,
        completed: false
      }
    ]
  },
  'nft-creation': {
    id: 'nft-creation',
    title: 'NFT Creation',
    description: 'Create and mint your first NFT on Solana',
    reward: '0.8 SOL',
    xp: 300,
    image: nftCreationImg,
    category: 'NFT',
    partner: {
      name: 'Magic Eden',
      logo: magicedenLogo,
      website: 'https://magiceden.io'
    },
    subtasks: [
      {
        id: 'nft-creation-1',
        title: 'Design your NFT',
        description: 'Create a digital artwork for your NFT',
        xp: 75,
        completed: false
      },
      {
        id: 'nft-creation-2',
        title: 'Set up a Solana wallet',
        description: 'Create a wallet that supports NFTs',
        xp: 75,
        completed: false
      },
      {
        id: 'nft-creation-3',
        title: 'Choose an NFT marketplace',
        description: 'Explore Magic Eden, Tensor, or other marketplaces',
        xp: 75,
        completed: false
      },
      {
        id: 'nft-creation-4',
        title: 'Mint your NFT',
        description: 'Follow the minting process on your chosen platform',
        xp: 75,
        completed: false
      }
    ]
  },
  'staking-basics': {
    id: 'staking-basics',
    title: 'Staking Basics',
    description: 'Learn how to stake SOL and earn passive rewards',
    reward: '0.3 SOL',
    xp: 150,
    image: stakingBasicsImg,
    category: 'Staking',
    partner: {
      name: 'Marinade',
      logo: marinadeLogo,
      website: 'https://marinade.finance'
    },
    subtasks: [
      {
        id: 'staking-basics-1',
        title: 'Understand staking concepts',
        description: 'Learn about validators, rewards, and risks',
        xp: 30,
        completed: false
      },
      {
        id: 'staking-basics-2',
        title: 'Research validators',
        description: 'Find a reliable validator with good performance',
        xp: 40,
        completed: false
      },
      {
        id: 'staking-basics-3',
        title: 'Stake your SOL',
        description: 'Delegate your SOL to your chosen validator',
        xp: 40,
        completed: false
      },
      {
        id: 'staking-basics-4',
        title: 'Monitor your staking rewards',
        description: 'Track your earnings over time',
        xp: 40,
        completed: false
      }
    ]
  }
};

// Mock leaderboard data
export const leaderboardData = [
  { rank: 1, username: 'SolanaWhale', points: 12500, walletAddress: '8ZJ...' },
  { rank: 2, username: 'CryptoNinja', points: 10800, walletAddress: '3PF...' },
  { rank: 3, username: 'BlockchainMaster', points: 9200, walletAddress: '7YT...' },
  { rank: 4, username: 'TokenCollector', points: 8700, walletAddress: '2QR...' },
  { rank: 5, username: 'NFTHunter', points: 7500, walletAddress: '5XZ...' },
  { rank: 6, username: 'SolDeveloper', points: 6900, walletAddress: '9AB...' },
  { rank: 7, username: 'CryptoPioneer', points: 5800, walletAddress: '1CD...' },
  { rank: 8, username: 'DeFiExplorer', points: 4700, walletAddress: '6EF...' },
  { rank: 9, username: 'TokenTrader', points: 3600, walletAddress: '4GH...' },
  { rank: 10, username: 'SolanaBuilder', points: 2500, walletAddress: '0IJ...' }
];

// Mock user profile data
export const userProfileData = {
  username: 'SolanaExplorer',
  walletAddress: '5YourWalletAddressHere',
  joinedDate: '2023-09-15',
  totalXP: 1250,
  completedQuests: 3,
  inProgressQuests: 2,
  referralCode: 'SOLEXP123',
  referralCount: 5,
  badges: [
    { id: 'early-adopter', name: 'Early Adopter', description: 'Joined during the beta phase' },
    { id: 'quest-master', name: 'Quest Master', description: 'Completed 3 quests' },
    { id: 'community-builder', name: 'Community Builder', description: 'Referred 5 friends' }
  ]
};

// Export all mock data
export default {
  quests: questsData,
  questDetails: questDetailsData,
  leaderboard: leaderboardData,
  userProfile: userProfileData
};
