import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuestCard from '../components/QuestCard';
import useSolanaWallet from '../hooks/useWallet';
import NFTShowcase from '../components/NFTShowcase';
import DailyCheckIn from '../components/DailyCheckIn';

function Dashboard() {
  const { connected } = useSolanaWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredQuestProgress, setFeaturedQuestProgress] = useState(0);
  
  // Sample quests data
  const featuredQuest = {
    id: 'featured-1',
    title: 'Solana Safari',
    description: 'Embark on a journey through the Solana ecosystem. Learn about dApps, NFTs, and DeFi protocols while earning rewards.',
    reward: 2.5,
    xp: 500,
    progress: featuredQuestProgress,
    bannerImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop',
  };
  
  // Function to handle starting the featured quest
  const handleStartFeaturedQuest = () => {
    if (!connected) {
      alert('Please connect your wallet to start this quest');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate starting the quest
    setTimeout(() => {
      setFeaturedQuestProgress(25);
      setIsLoading(false);
    }, 1500);
  };
  
  const quests = [
    {
      id: 'quest-1',
      title: 'DeFi Explorer',
      description: 'Learn about DeFi protocols on Solana and complete swaps',
      reward: '0.5',
      xp: 200,
      progress: 25,
      bannerImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2787&auto=format&fit=crop'
    },
    {
      id: 'quest-2',
      title: 'NFT Creation',
      description: 'Create and mint your first NFT on Solana',
      reward: '0.8',
      xp: 300,
      progress: 0,
      bannerImage: 'https://images.unsplash.com/photo-1645378999496-33c8c2afe6b2?q=80&w=2940&auto=format&fit=crop'
    },
    {
      id: 'quest-3',
      title: 'Staking Basics',
      description: 'Learn how to stake SOL and earn passive rewards',
      reward: '0.3',
      xp: 150,
      progress: 75,
      bannerImage: 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2832&auto=format&fit=crop'
    },
    {
      id: 'quest-4',
      title: 'Wallet Security',
      description: 'Implement best practices for securing your Solana wallet',
      reward: '0.2',
      xp: 100,
      progress: 0,
      bannerImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop'
    }
  ];

  return (
    <div>
      {/* NFT Showcase */}
      <NFTShowcase />
      
      {/* Daily Check-in and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <DailyCheckIn />
        </div>
        
        <div className="md:col-span-2 bg-dark-card rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
            <Link to="/leaderboard" className="text-sm text-solana-green hover:text-solana-green-light">View Full Leaderboard</Link>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${i === 1 ? 'bg-yellow-500' : i === 2 ? 'bg-gray-400' : 'bg-yellow-700'}`}>
                  <span className="text-black font-bold text-xs">{i}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">Solana {i === 1 ? 'Samurai' : i === 2 ? 'Ninja' : 'Warrior'}</div>
                  <div className="text-xs text-gray-400">abc{i}...xyz{i}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{10000 - (i * 800)}</div>
                  <div className="text-xs text-solana-green">{(3 - i) * 0.5} SOL</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Quest */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Quest</h2>
        <div className="bg-gradient-to-r from-solana-purple/20 to-solana-green/20 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 rounded-xl overflow-hidden">
              <img 
                src={featuredQuest.bannerImage} 
                alt={featuredQuest.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">{featuredQuest.title}</h3>
              <p className="text-white/80 mb-4">{featuredQuest.description}</p>
              <div className="flex items-center justify-between">
                <div className="reward-text text-xl">{featuredQuest.reward} SOL</div>
                <button 
                  className={`${featuredQuestProgress > 0 ? 'bg-solana-purple' : 'start-quest-btn'} py-2 px-4 rounded-lg flex items-center`}
                  onClick={handleStartFeaturedQuest}
                  disabled={isLoading || featuredQuestProgress === 100}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </>
                  ) : featuredQuestProgress > 0 ? (
                    'Continue Quest'
                  ) : (
                    'Start Quest'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quest Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Popular Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
