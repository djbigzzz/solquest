import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import useAuth from '../hooks/useAuth';
import { progressAPI } from '../services/api';

function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedQuestCount, setCompletedQuestCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Check if wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [connected, publicKey]);
  
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
  
  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (walletConnected && publicKey && isAuthenticated) {
        try {
          setLoading(true);
          
          // Short timeout to prevent flickering
          setTimeout(() => {
            setLoading(false);
          }, 300);
        } catch (error) {
          console.error('Error loading user data:', error);
          setLoading(false);
        }
      } else if (walletConnected && !isAuthenticated) {
        // If wallet is connected but not authenticated, show a message
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [walletConnected, publicKey, isAuthenticated]);
  
  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  
  // Calculate level based on points (1 level per 100 points)
  const calculateLevel = (points) => {
    return Math.max(1, Math.floor(points / 100));
  };
  
  // Quest definitions
  const allQuests = [
    {
      id: 'twitter-follow',
      title: 'Follow SolQuest on Twitter',
      description: 'Follow SolQuest on Twitter to stay updated with the latest news and announcements about our platform and ecosystem.',
      reward: '0',
      xp: 100,
      progress: 100,
      bannerImage: '/images/twitter-banner.jpg'
    },
    {
      id: 'nft-mint',
      title: 'Mint SolQuest OG NFT',
      description: 'Mint the exclusive SolQuest OG NFT. Only 10,000 will ever be minted, making this a rare collectible in the Solana ecosystem.',
      reward: '0',
      xp: 400,
      progress: 100,
      bannerImage: '/images/nft-banner.jpg'
    }
  ];
  
  // State for user progress
  const [userProgress, setUserProgress] = useState(null);
  
  // Fetch user progress from API
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (walletConnected && isAuthenticated) {
        try {
          console.log('Fetching user progress...');
          const progress = await progressAPI.getUserProgress();
          console.log('User progress data:', progress);
          setUserProgress(progress);
          
          // Update points and completed quests count
          setUserPoints(progress.totalPoints || 0);
          
          // Count completed quests
          let completedCount = 0;
          if (progress.twitterQuestCompleted) completedCount++;
          if (progress.nftQuestCompleted) completedCount++;
          setCompletedQuestCount(completedCount);
        } catch (error) {
          console.error('Error fetching user progress:', error);
        }
      }
    };
    
    fetchUserProgress();
    
    // Set up an interval to refresh progress data every 10 seconds
    const refreshInterval = setInterval(fetchUserProgress, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [walletConnected, isAuthenticated]);
  
  // Get completed quests based on API data
  const getCompletedQuests = () => {
    if (!userProgress) return [];
    
    const completedQuests = [];
    
    // Check Twitter quest completion
    if (userProgress.twitterQuestCompleted) {
      completedQuests.push(allQuests[0]);
    }
    
    // Check NFT quest completion
    if (userProgress.nftQuestCompleted) {
      completedQuests.push(allQuests[1]);
    }
    
    return completedQuests;
  };
  
  // Get user badges based on completed quests
  const getUserBadges = () => {
    if (!userProgress) return [];
    
    const badges = [];
    
    // Check Twitter quest completion for Twitter badge
    if (userProgress.twitterQuestCompleted) {
      badges.push({ id: 'badge-1', name: 'SolQuest Follower', icon: '🐦' });
    }
    
    // Check NFT quest completion for NFT badge
    if (userProgress.nftQuestCompleted) {
      badges.push({ id: 'badge-2', name: 'OG NFT Holder', icon: '🎭' });
    }
    
    return badges;
  };
  
  // Get completed quests and badges
  const completedQuests = getCompletedQuests();
  const badges = getUserBadges();

  return (
    <div className="container mx-auto px-4 py-8">
      {!walletConnected ? (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-200 mb-4">Connect Your Wallet</h2>
          <p className="text-yellow-200/70 text-lg mb-6">Please connect your Solana wallet to view your profile</p>
          <p className="text-yellow-200/50">Your profile will show your completed quests, points earned, and badges</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 bg-gray-700 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">SolQuest Explorer</h1>
                    <p className="text-white/70 text-sm">Wallet: {formatWalletAddress(publicKey?.toString())}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                    <p className="text-white/70 text-sm mb-1">Points Earned</p>
                    <p className="text-2xl font-semibold text-purple-400">{userPoints} <span className="text-white/50 text-sm">pts</span></p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                    <p className="text-white/70 text-sm mb-1">Level</p>
                    <p className="text-2xl font-semibold text-green-400">{calculateLevel(userPoints)}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                    <p className="text-white/70 text-sm mb-1">SOL Balance</p>
                    <p className="text-2xl font-semibold text-yellow-400">{balance.toFixed(4)} <span className="text-white/50 text-sm">SOL</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
          {/* Badges */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Badges Earned</h2>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-md border border-gray-700">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <p className="font-semibold text-white">{badge.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">Complete quests to earn badges</p>
              </div>
            )}
          </div>
          
          {/* Points Summary */}
          <div className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Points Summary</h2>
            <div className="space-y-4">
              {userProgress && userProgress.twitterQuestCompleted && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-white">Twitter Follow Quest</span>
                  <span className="text-purple-400 font-semibold">+100 pts</span>
                </div>
              )}
              {userProgress && userProgress.nftQuestCompleted && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-white">NFT Mint Quest</span>
                  <span className="text-purple-400 font-semibold">+400 pts</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-white font-semibold">Total Points</span>
                <span className="text-purple-400 font-bold text-xl">{userPoints} pts</span>
              </div>
            </div>
          </div>
          
          {/* Completed Quests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Completed Quests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedQuests.map(quest => (
                <div key={quest.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                  <div className="h-40 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <div className="text-white text-4xl font-bold">{quest.id === 'twitter-follow' ? '🐦' : '🎭'}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{quest.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 font-semibold">+{quest.xp} points</span>
                      <div className="w-full max-w-[100px] bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Return to Quests */}
          <div className="text-center mt-12">
            <Link 
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Return to Quests
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilePage;
