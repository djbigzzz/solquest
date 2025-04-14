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
          // Try multiple endpoints to ensure we get a balance
          try {
            // First try official Solana endpoint
            const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
            const walletBalance = await connection.getBalance(publicKey);
            const solBalance = walletBalance / LAMPORTS_PER_SOL;
            console.log('SOL balance from primary endpoint:', solBalance);
            setBalance(solBalance);
            return; // Exit if successful
          } catch (primaryError) {
            console.error('Primary endpoint error:', primaryError);
            // Continue to fallback
          }
          
          try {
            // Try cluster API endpoint as fallback
            const fallbackConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
            const fallbackBalance = await fallbackConnection.getBalance(publicKey);
            const solBalance = fallbackBalance / LAMPORTS_PER_SOL;
            console.log('SOL balance from fallback endpoint:', solBalance);
            setBalance(solBalance);
            return; // Exit if successful
          } catch (fallbackError) {
            console.error('Fallback endpoint error:', fallbackError);
            // Continue to next fallback
          }
          
          // Last resort: try RPC proxy
          const proxyConnection = new Connection('https://solana-mainnet.g.alchemy.com/v2/demo', 'confirmed');
          const proxyBalance = await proxyConnection.getBalance(publicKey);
          const solBalance = proxyBalance / LAMPORTS_PER_SOL;
          console.log('SOL balance from proxy endpoint:', solBalance);
          setBalance(solBalance);
        } catch (error) {
          console.error('All balance fetch attempts failed:', error);
          setBalance(0); // Set to 0 if all attempts fail
        }
      } else {
        setBalance(0);
      }
    };
    
    fetchBalance();
    
    // Set up an interval to refresh balance every 30 seconds
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
          
          {/* Social Connections Section */}
          <div className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Social Accounts</h2>
            <p className="text-gray-400 mb-6">Connect your social accounts to complete quests and earn more rewards.</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Twitter Status */}
              <div className="bg-gray-700 rounded-lg px-4 py-3 flex items-center">
                <span className="text-blue-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </span>
                <span className="text-white mr-2">Twitter:</span>
                {userProgress && userProgress.twitterQuestStarted ? (
                  <span className="text-green-400 text-sm">Connected</span>
                ) : (
                  <span className="text-red-400 text-sm">Not Connected</span>
                )}
              </div>
              
              {/* Discord Status - Placeholder */}
              <div className="bg-gray-700 rounded-lg px-4 py-3 flex items-center">
                <span className="text-indigo-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </span>
                <span className="text-white mr-2">Discord:</span>
                <span className="text-yellow-400 text-sm">Coming Soon</span>
              </div>
            </div>
            
            <Link 
              to="/social-connections"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Manage Connected Accounts
            </Link>
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
