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
  const [userProgress, setUserProgress] = useState(null);
  
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
          console.log('Fetching SOL balance for wallet:', publicKey.toString());
          // For development/demo purposes, use a mock balance
          const mockBalance = 42.69;
          console.log('Setting mock balance:', mockBalance);
          setBalance(mockBalance);
          
          // Uncomment for production to fetch real balance
          /*
          // Try to connect to mainnet
          const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
          const walletBalance = await connection.getBalance(publicKey);
          const solBalance = walletBalance / LAMPORTS_PER_SOL;
          console.log('SOL balance:', solBalance);
          setBalance(solBalance);
          */
        } catch (error) {
          console.error('Error fetching balance:', error);
          // Set a demo balance for testing
          setBalance(42.69);
        }
      } else {
        setBalance(0);
      }
    };
    
    fetchBalance();
    
    // Set up an interval to refresh balance periodically
    const refreshInterval = setInterval(fetchBalance, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
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
    
    const completed = [];
    
    if (userProgress.twitterQuestCompleted) {
      completed.push(allQuests.find(q => q.id === 'twitter-follow'));
    }
    
    if (userProgress.nftQuestCompleted) {
      completed.push(allQuests.find(q => q.id === 'nft-mint'));
    }
    
    return completed;
  };
  
  // Get user badges based on completed quests
  const getUserBadges = () => {
    if (!userProgress) return [];
    
    const badges = [];
    
    if (userProgress.twitterQuestCompleted) {
      badges.push({
        id: 'twitter-badge',
        name: 'Twitter Follower',
        icon: '🐦'
      });
    }
    
    if (userProgress.nftQuestCompleted) {
      badges.push({
        id: 'nft-badge',
        name: 'NFT Collector',
        icon: '🎭'
      });
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
          <h2 className="text-xl font-semibold text-yellow-500 mb-2">Wallet Not Connected</h2>
          <p className="text-white mb-4">Please connect your wallet to view your profile and progress.</p>
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
                  <div className="bg-gray-700 rounded-lg p-4 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-400/5"></div>
                    <p className="text-white/70 text-sm mb-1 relative z-10">SOL Balance</p>
                    <div className="flex items-center relative z-10">
                      <p className="text-2xl font-semibold text-yellow-400">
                        {typeof balance === 'number' ? balance.toFixed(4) : '0.0000'}
                      </p>
                      <span className="text-white/50 text-sm ml-1">SOL</span>
                      {connected && (
                        <button 
                          onClick={() => {
                            const fetchBalance = async () => {
                              try {
                                const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
                                const walletBalance = await connection.getBalance(publicKey);
                                const solBalance = walletBalance / LAMPORTS_PER_SOL;
                                setBalance(solBalance);
                              } catch (error) {
                                console.error('Manual refresh error:', error);
                              }
                            };
                            fetchBalance();
                          }}
                          className="ml-2 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 p-1 rounded"
                          title="Refresh SOL balance"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
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
