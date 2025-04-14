import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { progressAPI } from '../services/api';
import useAuth from '../hooks/useAuth';

function NFTMintQuest() {
  const { publicKey, connected } = useWallet();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [activeTask, setActiveTask] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  // XP reward for this quest
  const xpReward = 400;
  
  // Fetch user progress when component mounts
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (connected && publicKey && isAuthenticated) {
        try {
          setLoading(true);
          const response = await progressAPI.getUserProgress(publicKey.toString());
          if (response.data) {
            setStarted(response.data.nftQuestStarted || false);
            setCompleted(response.data.nftQuestCompleted || false);
            setProgress(response.data.nftQuestCompleted ? 100 : response.data.nftQuestStarted ? 25 : 0);
          }
        } catch (error) {
          console.error('Error fetching user progress:', error);
          setError('Failed to load quest data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProgress();
  }, [connected, publicKey, isAuthenticated]);

  // Start the quest
  const handleStartQuest = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isAuthenticated) {
      setError('Please authenticate first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update progress in the database
      await progressAPI.startNFTQuest(publicKey.toString());

      // Update local state
      setStarted(true);
      setProgress(25);
    } catch (error) {
      console.error('Error starting quest:', error);
      setError('Failed to start quest');
    } finally {
      setLoading(false);
    }
  };

  // Verify quest completion
  const handleVerifyQuest = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isAuthenticated) {
      setError('Please authenticate first');
      return;
    }

    if (!started) {
      setError('Please start the quest first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Simulate minting process with progress updates
      for (let i = 30; i <= 90; i += 20) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Call API to verify NFT mint
      const response = await progressAPI.verifyNFTQuest(publicKey.toString());

      if (response.data && response.data.verified) {
        setCompleted(true);
        setProgress(100);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying quest:', error);
      setError('Failed to verify quest');
    } finally {
      setLoading(false);
    }
  };

  // Calculate step indicators based on progress
  const steps = [
    { complete: progress >= 25 },
    { complete: progress >= 50 },
    { complete: progress >= 75 },
    { complete: progress >= 100 }
  ];

  // Render quest card
  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-md border border-gray-800 hover:border-purple-500/30 transition-all">
      {/* Quest Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <div className="flex items-center">
          <div className="bg-gray-800 text-xs text-gray-400 px-2 py-1 rounded mr-2">Premium Quest</div>
          <div className="flex items-center text-xs text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Limited Time
          </div>
        </div>
        <div className="bg-pink-900/40 rounded px-2 py-1">
          <span className="text-xs font-medium text-pink-300">NFT</span>
        </div>
      </div>

      {/* Quest Title */}
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-xl font-bold text-white">SolQuest NFT Mint</h2>
        <p className="text-sm text-gray-400 mt-1">Mint the exclusive SolQuest OG NFT. Limited edition of 10,000 available.</p>
        <div className="mt-2 flex items-center">
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-pink-500 h-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="ml-2 text-xs text-gray-400">{progress}%</span>
        </div>
      </div>
      
      {/* Task Steps */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex justify-between mb-4">
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full ${activeTask === 1 ? 'bg-pink-500' : completed ? 'bg-green-500' : 'bg-gray-700'} text-white`}
            onClick={() => setActiveTask(1)}
          >
            {completed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            )}
          </div>
          <div className="flex-1 mx-2 border-t border-gray-700 self-center"></div>
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full ${activeTask === 2 ? 'bg-pink-500' : 'bg-gray-700'} text-white`}
            onClick={() => started && setActiveTask(2)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 mx-2 border-t border-gray-700 self-center"></div>
          <div 
            className={`flex items-center justify-center w-8 h-8 rounded-full ${activeTask === 3 ? 'bg-pink-500' : 'bg-gray-700'} text-white`}
            onClick={() => started && completed && setActiveTask(3)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        {/* Active Task Content */}
        <div className="mb-4">
          {activeTask === 1 && (
            <div>
              <h3 className="text-white font-medium mb-2">Mint</h3>
              <p className="text-sm text-gray-400 mb-3">Start the minting process for your SolQuest OG NFT.</p>
            </div>
          )}
          {activeTask === 2 && (
            <div>
              <h3 className="text-white font-medium mb-2">Verify</h3>
              <p className="text-sm text-gray-400 mb-3">Verify that you've successfully minted the NFT.</p>
            </div>
          )}
          {activeTask === 3 && (
            <div>
              <h3 className="text-white font-medium mb-2">Claim</h3>
              <p className="text-sm text-gray-400 mb-3">Claim your rewards for completing this quest.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white text-sm font-medium mb-1">Rewards</h3>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-purple-400 font-bold text-sm mr-1">{xpReward}</span>
              <span className="text-gray-400 text-xs">points</span>
              <span className="ml-2 text-pink-400 text-xs">+ NFT</span>
            </div>
          </div>
          
          <div>
            <button 
              className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded"
            >
              {completed ? 'COMPLETED' : 'MEDIUM REWARD'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="px-4 pb-4 mt-2">
        {!completed ? (
          <button
            onClick={started ? handleVerifyQuest : handleStartQuest}
            disabled={loading || !connected || !isAuthenticated}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : activeTask === 1 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span>Mint NFT</span>
              </>
            ) : activeTask === 2 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verify Mint</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Claim Rewards</span>
              </>
            )}
          </button>
        ) : (
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed
          </button>
        )}
      </div>
      
      {/* Error Message - Only show if there's an error */}
      {error && (
        <div className="px-4 pb-3">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default NFTMintQuest;
