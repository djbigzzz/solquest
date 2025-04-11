import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import useSolanaWallet from '../hooks/useWallet';
import QuestSubtask from '../components/QuestSubtask';
import confetti from 'canvas-confetti';

// Import quest images
import solanaBasicsImg from '../assets/images/solana-basics.svg';
import solquestProjectImg from '../assets/images/solquest-project.svg';
import defiExplorerImg from '../assets/images/defi-explorer.svg';
import nftCreationImg from '../assets/images/nft-creation.svg';
import stakingBasicsImg from '../assets/images/staking-basics.svg';

// Import partner logos
import phantomLogo from '../assets/images/partners/phantom.svg';
import solflareLogo from '../assets/images/partners/solflare.svg';
import magicedenLogo from '../assets/images/partners/magiceden.svg';
import orcaLogo from '../assets/images/partners/orca.svg';
import marinadeLogo from '../assets/images/partners/marinade.svg';

// Mock data for quest subtasks
const questsData = {
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

const QuestDetail = () => {
  const { questId } = useParams();
  const [quest, setQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected } = useWallet();
  const { formatWalletAddress } = useSolanaWallet();
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchQuest = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Map old quest IDs to new ones for backward compatibility
        const idMap = {
          'quest-1': 'defi-explorer',
          'quest-2': 'nft-creation',
          'quest-3': 'staking-basics'
        };
        
        const mappedQuestId = idMap[questId] || questId;
        
        if (questsData[mappedQuestId]) {
          setQuest(questsData[mappedQuestId]);
          setSubtasks(questsData[mappedQuestId].subtasks);
        } else {
          setError('Quest not found');
        }
        setIsLoading(false);
      }, 1000);
    };
    
    fetchQuest();
  }, [questId]);

  const handleSubtaskComplete = (subtaskId) => {
    if (!connected) {
      alert('Please connect your wallet to complete this subtask');
      return;
    }

    setSubtasks(prevSubtasks => 
      prevSubtasks.map(subtask => 
        subtask.id === subtaskId ? { ...subtask, completed: true } : subtask
      )
    );
    
    // Update progress after subtask completion
    setTimeout(() => {
      const updatedProgress = calculateProgress();
      if (updatedProgress === 100) {
        showCelebration();
      }
    }, 100);
  };
  

  // Function to show celebration animation
  const showCelebration = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const calculateProgress = () => {
    if (!subtasks.length) return 0;
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };

  const totalXP = subtasks.reduce((sum, subtask) => sum + (subtask.completed ? subtask.xp : 0), 0);
  const progress = calculateProgress();
  const allCompleted = progress === 100;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-dark-card rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Quest not found</h2>
          <p className="mb-4">The quest you're looking for doesn't exist.</p>
          <Link to="/quests" className="text-solana-purple hover:text-solana-green">
            ← Back to Quests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/quests" className="text-solana-purple hover:text-solana-green mb-4 inline-block">
        ← Back to Quests
      </Link>
      
      <div className="bg-dark-card rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="relative">
          <img 
            src={quest.image || solanaBasicsImg} 
            alt={quest.title} 
            className="w-full h-48 md:h-64 object-cover"
          />
          {quest.featured && (
            <div className="absolute top-0 right-0 bg-solana-green text-white text-xs font-bold px-2 py-1 m-4 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{quest.title}</h1>
              <p className="text-gray-300 mb-4">{quest.description}</p>
              {quest.partner && (
                <div className="flex items-center mb-4">
                  <p className="text-gray-400 mr-2">Partner:</p>
                  <div className="flex items-center">
                    <img 
                      src={quest.partner.logo} 
                      alt={quest.partner.name} 
                      className="w-6 h-6 rounded-full mr-2" 
                    />
                    <a 
                      href={quest.partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solana-green hover:text-solana-green-light transition-colors"
                    >
                      {quest.partner.name}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-solana-purple to-solana-green text-white px-4 py-2 rounded-lg">
              Reward: {quest.reward}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Progress: {progress}%</span>
              <span className="text-gray-300">XP Earned: {totalXP}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-solana-purple to-solana-green h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-2">Subtasks</h2>
            
            {subtasks.map((subtask) => (
              <div key={subtask.id}>
                <QuestSubtask 
                  subtask={subtask} 
                  onComplete={handleSubtaskComplete}
                />
                {subtask.socialLink && !subtask.completed && (
                  <div className="mt-2 ml-8 mb-4">
                    <a 
                      href={subtask.socialLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solana-purple hover:text-solana-green text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit to complete this task
                    </a>
                  </div>
                )}
                {subtask.nftLink && !subtask.completed && (
                  <div className="mt-2 ml-8 mb-4">
                    <a 
                      href={subtask.nftLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solana-purple hover:text-solana-green text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Purchase NFT
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700">
          {allCompleted ? (
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-white">All subtasks completed!</h3>
                <p className="text-gray-400 text-sm">You've earned {quest.reward}</p>
                {quest.id === 'solquest-project' && (
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-4 w-4 rounded-full bg-solana-green mr-2"></span>
                    <span className="text-solana-green text-xs">Includes exclusive NFT reward!</span>
                  </div>
                )}
              </div>
              <button 
                className="bg-gradient-to-r from-solana-purple to-solana-green text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-full md:w-auto"
                onClick={() => {
                  if (quest.id === 'solquest-project') {
                    alert(`Congratulations! You've earned ${quest.reward.split(' + ')[0]} SOL and an exclusive SolQuest NFT has been sent to your wallet!`);
                  } else {
                    alert(`Reward of ${quest.reward} has been sent to your wallet!`);
                  }
                }}
              >
                Claim Reward
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-white">Complete all subtasks to earn your reward</h3>
                <p className="text-gray-400 text-sm">{progress}% complete</p>
                {quest.id === 'solquest-project' && (
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-4 w-4 rounded-full bg-purple-400 mr-2"></span>
                    <span className="text-purple-400 text-xs">Includes exclusive NFT reward!</span>
                  </div>
                )}
              </div>
              <button 
                className="bg-gray-700 text-gray-300 px-6 py-3 rounded-lg cursor-not-allowed w-full md:w-auto"
                disabled
              >
                Claim Reward
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
