import React, { useState, useEffect } from 'react';
import QuestCard from '../components/QuestCard';
import useSolanaWallet from '../hooks/useWallet';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

function ProfilePage() {
  const { publicKey, connected, formatWalletAddress } = useSolanaWallet();
  const [balance, setBalance] = useState(0);
  
  // Fetch wallet balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
          const walletBalance = await connection.getBalance(publicKey);
          setBalance(walletBalance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };
    
    fetchBalance();
  }, [connected, publicKey]);
  
  // User data - combines static data with wallet info when connected
  const user = {
    name: connected ? 'Solana Explorer' : 'Guest User',
    wallet: connected ? publicKey.toString() : '8xft7UBgxfbJDpx7PzKLgPPNoQJAkU4Z2kHbXRc9WxQN',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
    level: 5,
    xp: 850,
    solBalance: connected ? balance : 12.45,
    joinedDate: 'April 2025',
    badges: [
      { id: 'badge-1', name: 'Solana Pioneer', icon: '🚀' },
      { id: 'badge-2', name: 'NFT Creator', icon: '🎨' },
      { id: 'badge-3', name: 'DeFi Explorer', icon: '💰' },
    ],
  };
  
  // Sample completed quests
  const completedQuests = [
    {
      id: 'quest-c1',
      title: 'Solana Basics',
      description: 'Learn the fundamentals of Solana blockchain',
      reward: '0.2',
      xp: 100,
      progress: 100,
      bannerImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop'
    },
    {
      id: 'quest-c2',
      title: 'Wallet Setup',
      description: 'Set up and secure your Solana wallet',
      reward: '0.1',
      xp: 50,
      progress: 100,
      bannerImage: 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2832&auto=format&fit=crop'
    }
  ];
  
  // Sample in-progress quests
  const inProgressQuests = [
    {
      id: 'quest-p1',
      title: 'DeFi Explorer',
      description: 'Learn about DeFi protocols on Solana and complete swaps',
      reward: '0.5',
      xp: 200,
      progress: 25,
      bannerImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2787&auto=format&fit=crop'
    },
    {
      id: 'quest-p2',
      title: 'Staking Basics',
      description: 'Learn how to stake SOL and earn passive rewards',
      reward: '0.3',
      xp: 150,
      progress: 75,
      bannerImage: 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2832&auto=format&fit=crop'
    }
  ];

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-card-bg rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-solana-purple">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-white/70 text-sm">Joined {user.joinedDate}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <button className="bg-solana-purple text-white py-2 px-4 rounded-lg text-sm">
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-dark-bg rounded-lg p-3">
                <p className="text-white/70 text-sm">Wallet</p>
                <p className="text-sm font-mono truncate">{user.wallet}</p>
              </div>
              <div className="bg-dark-bg rounded-lg p-3">
                <p className="text-white/70 text-sm">Level</p>
                <p className="text-xl font-semibold">{user.level} <span className="text-white/70 text-sm">({user.xp} XP)</span></p>
              </div>
              <div className="bg-dark-bg rounded-lg p-3">
                <p className="text-white/70 text-sm">SOL Balance</p>
                <p className="text-xl font-semibold text-solana-green">{user.solBalance} SOL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-4">
          {user.badges.map(badge => (
            <div key={badge.id} className="bg-card-bg rounded-xl p-4 flex items-center gap-3">
              <div className="text-3xl">{badge.icon}</div>
              <div>
                <p className="font-semibold">{badge.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* In Progress Quests */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">In Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inProgressQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
      
      {/* Completed Quests */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Completed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
