import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { progressAPI, questsAPI } from '../services/api';
import confetti from 'canvas-confetti';

function QuestsPage() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useAuth();
  const [activeQuest, setActiveQuest] = useState('social'); // 'social' or 'nft'
  
  // Quest progress states
  const [socialStarted, setSocialStarted] = useState(false);
  const [socialCompleted, setSocialCompleted] = useState(false);
  const [nftStarted, setNftStarted] = useState(false);
  const [nftCompleted, setNftCompleted] = useState(false);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'local-only', 'syncing'
  
  // Check API health status
  const checkApiHealth = async () => {
    try {
      console.log('Checking API health status...');
      // Try multiple endpoints to find one that works
      const endpoints = [
        '/api/health',
        'https://solquest.io/api/health',
        'https://solquest-app-new.vercel.app/api/health',
        '/api/db-connect',
        'https://solquest.io/api/db-connect',
        'https://solquest-app-new.vercel.app/api/db-connect'
      ];
      
      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-cache'
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`API health check successful for ${endpoint}:`, data);
            return true;
          } else {
            console.warn(`API health check failed for ${endpoint} with status: ${response.status}`);
          }
        } catch (endpointErr) {
          console.warn(`Error checking endpoint ${endpoint}:`, endpointErr.message);
        }
      }
      
      console.error('All API health endpoints failed');
      return false;
    } catch (err) {
      console.error('API health check failed:', err);
      return false;
    }
  };

  // Fetch user's quest progress on mount and when wallet/auth changes
  useEffect(() => {
    if (connected && publicKey) {
      // First check API health, then fetch user progress
      checkApiHealth().then(isHealthy => {
        if (isHealthy) {
          fetchUserProgress();
        } else {
          // If API is not healthy, set error message and use local storage
          setError('Unable to connect to SolQuest servers. Your progress will be saved locally until connection is restored.');
          setSyncStatus('local-only');
          
          // Try to load from local storage
          const localProgress = localStorage.getItem('solquest_progress');
          if (localProgress) {
            try {
              const parsedProgress = JSON.parse(localProgress);
              setSocialStarted(parsedProgress.twitterQuestStarted || false);
              setSocialCompleted(parsedProgress.twitterQuestCompleted || false);
              setNftStarted(parsedProgress.nftQuestStarted || false);
              setNftCompleted(parsedProgress.nftQuestCompleted || false);
              setRewardsClaimed(parsedProgress.rewardsClaimed || false);
            } catch (localErr) {
              console.error('Error parsing local progress:', localErr);
            }
          }
        }
      });
    }
  }, [connected, publicKey, isAuthenticated]);
  
  // Fetch user progress from API
  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      console.log('Fetching user progress from API...');
      const progress = await progressAPI.getUserProgress();
      console.log('User progress received:', progress);
      
      // Update local state based on API response
      if (progress) {
        setSocialStarted(progress.twitterQuestStarted || false);
        setSocialCompleted(progress.twitterQuestCompleted || false);
        setNftStarted(progress.nftQuestStarted || false);
        setNftCompleted(progress.nftQuestCompleted || false);
        setRewardsClaimed(progress.rewardsClaimed || false);
        
        // Save to local storage as backup
        const progressToSave = {
          twitterQuestStarted: progress.twitterQuestStarted || false,
          twitterQuestCompleted: progress.twitterQuestCompleted || false,
          nftQuestStarted: progress.nftQuestStarted || false,
          nftQuestCompleted: progress.nftQuestCompleted || false,
          rewardsClaimed: progress.rewardsClaimed || false,
          lastSynced: new Date().toISOString()
        };
        localStorage.setItem('solquest_progress', JSON.stringify(progressToSave));
        
        setSyncStatus('synced');
        setError(null);
        console.log('Progress successfully synced with server');
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
      
      // Check if it's a network error or API-specific error
      if (err.message && err.message.includes('Network Error')) {
        setError('Failed to sync with server. Your progress is only saved locally.');
      } else {
        setError('Failed to load your quest progress. Please try again.');
      }
      
      // Try to load from local storage as fallback
      const localProgress = localStorage.getItem('solquest_progress');
      if (localProgress) {
        try {
          console.log('Loading progress from local storage');
          const parsedProgress = JSON.parse(localProgress);
          setSocialStarted(parsedProgress.twitterQuestStarted || false);
          setSocialCompleted(parsedProgress.twitterQuestCompleted || false);
          setNftStarted(parsedProgress.nftQuestStarted || false);
          setNftCompleted(parsedProgress.nftQuestCompleted || false);
          setRewardsClaimed(parsedProgress.rewardsClaimed || false);
          setSyncStatus('local-only');
          console.log('Loaded progress from local storage');
        } catch (localErr) {
          console.error('Error parsing local progress:', localErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to save progress to local storage
  const saveProgressToLocalStorage = (syncState = 'local-only') => {
    const progress = {
      twitterQuestStarted: socialStarted,
      twitterQuestCompleted: socialCompleted,
      nftQuestStarted: nftStarted,
      nftQuestCompleted: nftCompleted,
      rewardsClaimed: rewardsClaimed,
      lastSynced: syncState === 'synced' ? new Date().toISOString() : null
    };
    localStorage.setItem('solquest_progress', JSON.stringify(progress));
    
    // Update sync status
    setSyncStatus(syncState);
  };
  
  // Quest handlers
  const handleStartSocial = async () => {
    window.open('https://x.com/SolQuestio', '_blank');
    setSocialStarted(true);
    
    // Try to update backend
    try {
      if (connected && publicKey) {
        await progressAPI.updateTwitterQuest({
          walletAddress: publicKey.toString(),
          started: true,
          completed: false
        });
        // Successfully synced with server
        saveProgressToLocalStorage('synced');
      }
    } catch (err) {
      console.error('Error updating Twitter quest progress:', err);
      // Only saved locally
      saveProgressToLocalStorage('local-only');
    }
  };
  
  const handleVerifySocial = async () => {
    setSocialCompleted(true);
    
    // Try to update backend
    try {
      if (connected && publicKey) {
        await progressAPI.updateTwitterQuest({
          walletAddress: publicKey.toString(),
          started: true,
          completed: true
        });
        // Successfully synced with server
        saveProgressToLocalStorage('synced');
      }
    } catch (err) {
      console.error('Error updating Twitter quest completion:', err);
      // Only saved locally
      saveProgressToLocalStorage('local-only');
    }
  };
  
  const handleStartNFT = async () => {
    window.open('https://solquest.io/mint', '_blank');
    setNftStarted(true);
    
    // Try to update backend
    try {
      if (connected && publicKey) {
        await progressAPI.updateNFTQuest({
          walletAddress: publicKey.toString(),
          started: true,
          completed: false
        });
        // Successfully synced with server
        saveProgressToLocalStorage('synced');
      }
    } catch (err) {
      console.error('Error updating NFT quest progress:', err);
      // Only saved locally
      saveProgressToLocalStorage('local-only');
    }
  };
  
  const handleVerifyNFT = async () => {
    setNftCompleted(true);
    
    // Try to update backend
    try {
      if (connected && publicKey) {
        await progressAPI.updateNFTQuest({
          walletAddress: publicKey.toString(),
          started: true,
          completed: true
        });
        // Successfully synced with server
        saveProgressToLocalStorage('synced');
      }
    } catch (err) {
      console.error('Error updating NFT quest completion:', err);
      // Only saved locally
      saveProgressToLocalStorage('local-only');
    }
  };
  
  // Function to retry syncing with the server
  const handleRetrySync = async () => {
    setSyncStatus('syncing');
    try {
      // Try to sync Twitter quest progress
      if (socialStarted || socialCompleted) {
        await progressAPI.updateTwitterQuest({
          walletAddress: publicKey.toString(),
          started: socialStarted,
          completed: socialCompleted
        });
      }
      
      // Try to sync NFT quest progress
      if (nftStarted || nftCompleted) {
        await progressAPI.updateNFTQuest({
          walletAddress: publicKey.toString(),
          started: nftStarted,
          completed: nftCompleted
        });
      }
      
      // Try to sync rewards claimed status
      if (rewardsClaimed) {
        await progressAPI.claimQuestRewards({
          walletAddress: publicKey.toString(),
          questId: 'solquest-onboarding',
          timestamp: new Date().toISOString()
        });
      }
      
      // Successfully synced with server
      saveProgressToLocalStorage('synced');
      setError(null);
    } catch (err) {
      console.error('Error syncing with server:', err);
      setSyncStatus('local-only');
      setError('Failed to sync with server. Your progress is only saved locally.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">SolQuest Quests</h1>
          <p className="text-gray-400">Complete quests to earn points and exclusive rewards</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="bg-purple-900/30 px-3 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <span className="text-purple-300 text-sm">Basic Quest</span>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-3 py-1 rounded-full">
            <span className="text-blue-300 text-sm">Limited Time</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6 text-center max-w-md mx-auto">
          <p className="text-red-200">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-300 text-sm hover:text-red-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {syncStatus === 'local-only' && !error && (
        <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-4 mb-6 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-amber-300 font-medium">Your progress is only saved locally</span>
          </div>
          <p className="text-amber-200/80 text-sm mb-3">Your quest progress has not been synchronized with our servers. Points and rewards may not be credited to your account until synced.</p>
          <button 
            onClick={handleRetrySync}
            disabled={syncStatus === 'syncing'}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center mx-auto"
          >
            {syncStatus === 'syncing' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Sync
              </>
            )}
          </button>
        </div>
      )}

      {!connected ? (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-5 mb-6 text-center max-w-md mx-auto">
          <p className="text-yellow-200">Please connect your wallet to access quests</p>
          <button 
            onClick={() => window.dispatchEvent(new Event('openWalletModal'))}
            className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-6 shadow-xl border border-gray-800">
          {/* Quest Overview */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">Quest Progress</span>
                <div className="flex items-center">
                  <span className="text-gray-400 text-xs">{(socialCompleted && nftCompleted) ? '100' : (socialCompleted || nftCompleted) ? '50' : '0'}%</span>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full ml-2">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300" 
                      style={{ width: `${(socialCompleted && nftCompleted) ? 100 : (socialCompleted || nftCompleted) ? 50 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">SolQuest Rewards Program</h2>
              <p className="text-gray-400">Complete tasks to earn points and exclusive NFT rewards.</p>
            </div>
            
            <div className="mt-4 md:mt-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-800/30">
              <div className="flex items-center">
                <div className="bg-purple-900/50 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Rewards</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold">150</span>
                    <span className="text-gray-400 text-sm ml-1">points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Single Quest Card with Two Subtasks */}
          <div className="flex flex-col space-y-8 mb-8">
            {/* Step 1: X Follow */}
            <div className={`flex flex-col md:flex-row items-center md:items-start bg-gray-800/70 rounded-xl p-6 border-2 ${!socialCompleted ? 'border-purple-600' : 'border-gray-700'} shadow-lg relative transition-all duration-300`}>  
              {/* Step Number & Status */}
              <div className="flex flex-col items-center mr-6">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full text-3xl font-bold mb-2 border-4 ${socialCompleted ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-purple-900/40 border-purple-500 text-purple-200'} transition-all duration-300`}>01</div>
                <span className={`text-xs font-semibold ${socialCompleted ? 'text-green-400' : socialStarted ? 'text-purple-400' : 'text-gray-400'}`}>{socialCompleted ? 'Completed' : socialStarted ? 'Active' : 'Active'}</span>
              </div>
              {/* Step Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Follow SolQuest on X</h3>
                <p className="text-gray-300 text-sm mb-4">Follow <span className="text-blue-400 font-semibold">@SolQuestio</span> on X (formerly Twitter) to unlock the next step.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleStartSocial}
                    disabled={socialCompleted}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${socialCompleted ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'}`}
                  >
                    {socialCompleted ? 'Started' : 'Start'}
                  </button>
                  <button
                    onClick={handleVerifySocial}
                    disabled={!socialStarted || socialCompleted}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${socialCompleted ? 'bg-green-600 text-white cursor-not-allowed' : (!socialStarted ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90')}`}
                  >
                    {socialCompleted ? (
                      <span className="flex items-center"><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Completed</span>
                    ) : 'Verify'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: NFT Mint */}
            <div className={`flex flex-col md:flex-row items-center md:items-start bg-gray-800/70 rounded-xl p-6 border-2 ${socialCompleted ? (!nftCompleted ? 'border-blue-500' : 'border-green-400') : 'border-gray-700'} shadow-lg relative transition-all duration-300`}>  
              {/* Step Number & Status */}
              <div className="flex flex-col items-center mr-6">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full text-3xl font-bold mb-2 border-4 ${nftCompleted ? 'bg-green-500/20 border-green-400 text-green-300' : socialCompleted ? 'bg-blue-900/40 border-blue-500 text-blue-200' : 'bg-gray-900/40 border-gray-600 text-gray-500'} transition-all duration-300`}>02</div>
                <span className={`text-xs font-semibold ${nftCompleted ? 'text-green-400' : socialCompleted ? 'text-blue-400' : 'text-gray-500'}`}>{nftCompleted ? 'Completed' : socialCompleted ? 'Active' : 'Locked'}</span>
              </div>
              {/* Step Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Mint Your NFT</h3>
                <p className="text-gray-300 text-sm mb-4">Mint your exclusive SolQuest NFT after following on X!</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleStartNFT}
                    disabled={!socialCompleted || nftCompleted}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${!socialCompleted || nftCompleted ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'}`}
                  >
                    {nftCompleted ? 'Started' : 'Start'}
                  </button>
                  <button
                    onClick={handleVerifyNFT}
                    disabled={!socialCompleted || !nftStarted || nftCompleted}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${nftCompleted ? 'bg-green-600 text-white cursor-not-allowed' : (!socialCompleted || !nftStarted ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90')}`}
                  >
                    {nftCompleted ? (
                      <span className="flex items-center"><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Completed</span>
                    ) : 'Verify'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 03 - Claim Rewards */}
            <div className={`bg-gray-900/30 rounded-lg p-5 border ${socialCompleted && nftCompleted ? 'border-yellow-600/50 bg-yellow-900/20' : 'border-gray-800/50'} relative ${socialCompleted && nftCompleted ? 'opacity-100' : 'opacity-70'}`}>
              <div className="absolute top-3 right-3">
                <div className={`${socialCompleted && nftCompleted ? 'bg-yellow-700/30 text-yellow-400' : 'bg-gray-700/20 text-gray-500'} text-xs px-2 py-1 rounded-full flex items-center`}>
                  {socialCompleted && nftCompleted ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlocked
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Locked
                    </>
                  )}
                </div>
              </div>
              <div className={`text-3xl font-bold ${socialCompleted && nftCompleted ? 'text-yellow-500' : 'text-gray-700'} mb-3`}>03</div>
              <h3 className={`text-lg font-semibold ${socialCompleted && nftCompleted ? 'text-yellow-400' : 'text-gray-500'} mb-1`}>Claim Rewards</h3>
              <p className={`${socialCompleted && nftCompleted ? 'text-yellow-300/70' : 'text-gray-500'} text-sm mb-4`}>Claim your 150 points and exclusive rewards!</p>
              
              <button 
                onClick={async () => {
                  if (socialCompleted && nftCompleted && !rewardsClaimed) {
                    try {
                      setLoading(true);
                      
                      // Call API to claim rewards
                      const result = await progressAPI.claimQuestRewards({
                        walletAddress: publicKey.toString(),
                        questId: 'solquest-onboarding',
                        timestamp: new Date().toISOString()
                      });
                      
                      if (result && result.success) {
                        setRewardsClaimed(true);
                        
                        // Update local storage with claimed status
                        const progress = {
                          twitterQuestStarted: socialStarted,
                          twitterQuestCompleted: socialCompleted,
                          nftQuestStarted: nftStarted,
                          nftQuestCompleted: nftCompleted,
                          rewardsClaimed: true
                        };
                        localStorage.setItem('solquest_progress', JSON.stringify(progress));
                        
                        // Show confetti celebration
                        const confettiCanvas = document.createElement('canvas');
                        confettiCanvas.style.position = 'fixed';
                        confettiCanvas.style.top = '0';
                        confettiCanvas.style.left = '0';
                        confettiCanvas.style.width = '100vw';
                        confettiCanvas.style.height = '100vh';
                        confettiCanvas.style.zIndex = '9999';
                        confettiCanvas.style.pointerEvents = 'none';
                        document.body.appendChild(confettiCanvas);
                        
                        const confettiEffect = confetti.create(confettiCanvas, {
                          resize: true,
                          useWorker: true
                        });
                        
                        confettiEffect({
                          particleCount: 200,
                          spread: 160,
                          origin: { y: 0.6 }
                        });
                        
                        setTimeout(() => {
                          document.body.removeChild(confettiCanvas);
                        }, 3000);
                        
                        // Show success message with points from API
                        alert(`Congratulations! You have claimed ${result.pointsEarned || 150} points and unlocked exclusive rewards!`);
                      } else {
                        setError('Failed to claim rewards. Please try again.');
                      }
                    } catch (err) {
                      console.error('Error claiming rewards:', err);
                      setError('Failed to claim rewards. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  } else if (rewardsClaimed) {
                    alert('You have already claimed rewards for this quest!');
                  }
                }}
                disabled={!socialCompleted || !nftCompleted || rewardsClaimed || loading}
                className={`w-full ${rewardsClaimed ? 'bg-green-600 text-white cursor-not-allowed' : socialCompleted && nftCompleted ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:opacity-90' : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'} px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : rewardsClaimed ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Rewards Claimed
                  </span>
                ) : socialCompleted && nftCompleted ? 'Claim Rewards' : 'Complete previous steps first'}
              </button>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-purple-900/30 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Need Help?</h3>
                <p className="text-gray-400 text-sm">Join our Discord community for support</p>
              </div>
            </div>
            
            <a 
              href="https://discord.gg/solquest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              Join Discord
            </a>
          </div>
        </div>
      )}
      
      {/* Coming Soon Section */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold text-white mb-4">More Quests Coming Soon</h2>
        <p className="text-gray-400 mb-6">Stay tuned for additional quests and opportunities to earn rewards!</p>
      </div>
    </div>
  );
}

export default QuestsPage;
