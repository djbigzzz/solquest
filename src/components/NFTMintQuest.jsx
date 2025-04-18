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
    <div className="rounded-lg overflow-hidden bg-gradient-to-b from-pink-900/30 to-purple-900/30 border-2 border-pink-500/50 shadow-lg">
      {/* Quest Header */}
      <div className="bg-gradient-to-r from-pink-800 to-purple-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-pink-700 text-xs text-white px-2 py-1 rounded-full font-bold mr-2">Premium Quest</div>
          <div className="flex items-center text-xs text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Limited Time
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-full px-3 py-1">
          <span className="text-xs font-bold text-white">NFT</span>
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
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex flex-col space-y-4">
          {/* Task 1 */}
          <div 
            className={`flex items-center p-3 rounded-lg ${activeTask === 1 ? 'bg-pink-500/10 border border-pink-500/30' : completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'} transition-colors cursor-pointer`}
            onClick={() => setActiveTask(1)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${completed ? 'bg-green-500' : activeTask === 1 ? 'bg-pink-500' : 'bg-gray-700'} text-white mr-3`}>
              {completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs">1</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Mint SolQuest NFT</h3>
              <p className="text-xs text-gray-400 mt-1">Start the minting process for your OG NFT</p>
            </div>
            <div className="ml-2">
              {completed ? (
                <span className="text-xs text-green-400">Completed</span>
              ) : started ? (
                <span className="text-xs text-yellow-400">In Progress</span>
              ) : (
                <span className="text-xs text-pink-400">Start</span>
              )}
            </div>
          </div>

          {/* Task 2 */}
          <div 
            className={`flex items-center p-3 rounded-lg ${activeTask === 2 ? 'bg-pink-500/10 border border-pink-500/30' : progress >= 50 && completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'} ${!started && 'opacity-60 cursor-not-allowed'} transition-colors ${started ? 'cursor-pointer' : ''}`}
            onClick={() => started && setActiveTask(2)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${progress >= 50 && completed ? 'bg-green-500' : activeTask === 2 ? 'bg-pink-500' : 'bg-gray-700'} text-white mr-3`}>
              {progress >= 50 && completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs">2</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Verify NFT Mint</h3>
              <p className="text-xs text-gray-400 mt-1">Verify that you've successfully minted the NFT</p>
            </div>
            <div className="ml-2">
              {!started ? (
                <span className="text-xs text-gray-500">Locked</span>
              ) : completed ? (
                <span className="text-xs text-green-400">Completed</span>
              ) : (
                <span className="text-xs text-pink-400">Verify</span>
              )}
            </div>
          </div>

          {/* Task 3 */}
          <div 
            className={`flex items-center p-3 rounded-lg ${activeTask === 3 ? 'bg-pink-500/10 border border-pink-500/30' : completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'} ${!completed && 'opacity-60 cursor-not-allowed'} transition-colors ${completed ? 'cursor-pointer' : ''}`}
            onClick={() => completed && setActiveTask(3)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${completed && activeTask === 3 ? 'bg-green-500' : activeTask === 3 ? 'bg-pink-500' : 'bg-gray-700'} text-white mr-3`}>
              <span className="text-xs">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Claim Your Rewards</h3>
              <p className="text-xs text-gray-400 mt-1">Get points and your NFT for completing this quest</p>
            </div>
            <div className="ml-2">
              {!completed ? (
                <span className="text-xs text-gray-500">Locked</span>
              ) : (
                <span className="text-xs text-pink-400">Claim</span>
              )}
            </div>
          </div>
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
      <div className="px-4 pb-4">
        {!completed ? (
          <>
            {activeTask === 1 && (
              <button
                onClick={handleStartQuest}
                disabled={loading || !connected || !isAuthenticated || completed}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>Start Quest</span>
                )}
              </button>
            )}
            
            {activeTask === 2 && (
              <button
                onClick={handleVerifyQuest}
                disabled={loading || !connected || !isAuthenticated || !started || completed}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>Verify NFT Mint</span>
                )}
              </button>
            )}
            
            {activeTask === 3 && (
              <button
                onClick={() => alert('NFT Rewards claimed!')}
                disabled={loading || !connected || !isAuthenticated || !completed}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>Claim {xpReward} Points</span>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Quest Completed!</span>
            </div>
            <p className="text-xs text-green-300/70 mt-1">You've earned {xpReward} points + NFT</p>
          </div>
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
