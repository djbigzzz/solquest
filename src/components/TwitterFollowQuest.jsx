import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { progressAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const TwitterFollowQuest = () => {
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
  const xpReward = 150;
  
  // Fetch user progress when component mounts
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (connected && publicKey && isAuthenticated) {
        try {
          setLoading(true);
          const response = await progressAPI.getUserProgress(publicKey.toString());
          if (response.data) {
            setStarted(response.data.twitterQuestStarted || false);
            setCompleted(response.data.twitterQuestCompleted || false);
            setProgress(response.data.twitterQuestCompleted ? 100 : response.data.twitterQuestStarted ? 50 : 0);
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

      // Check if user has connected Twitter account
      const response = await axios.get(`/api/user/social?wallet=${publicKey.toString()}`);
      if (!response.data?.twitter) {
        // Redirect to social connections page if Twitter is not connected
        window.location.href = '/social-connections';
        return;
      }

      // Open Twitter in a new tab
      window.open('https://twitter.com/SolQuestApp', '_blank');

      // Update progress in the database
      await progressAPI.startTwitterQuest(publicKey.toString());

      // Update local state
      setStarted(true);
      setProgress(50);
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

      // Call API to verify Twitter follow
      const response = await progressAPI.verifyTwitterQuest(publicKey.toString());

      if (response.data && response.data.verified) {
        setCompleted(true);
        setProgress(100);
      } else {
        setError('Verification failed. Please make sure you followed SolQuest on Twitter.');
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
    <div className="bg-blue-900/30 rounded-xl overflow-hidden shadow-xl border-4 border-blue-600/50 transform hover:scale-102 transition-all">
      {/* Quest Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-800 to-purple-800">
        <div className="flex items-center">
          <div className="bg-blue-700 text-xs text-white px-2 py-1 rounded-full font-bold mr-2 shadow-inner">⭐ Basic Quest</div>
          <div className="flex items-center text-xs text-white font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Limited Time
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">Social</div>
      </div>

      {/* Quest Title */}
      <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-blue-900/50 to-blue-800/10">
        <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center">
          <span className="bg-blue-600 text-white p-1 rounded-lg mr-2 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
          TWITTER QUEST
        </h2>
        <p className="text-blue-200 text-sm mt-2 ml-10 italic">Follow SolQuest on Twitter to stay updated with the latest announcements and rewards.</p>
        <div className="mt-3 flex items-center">
          <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full shadow-lg" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="ml-2 text-xs font-bold text-white bg-blue-700 px-2 py-1 rounded-full">{progress}%</span>
        </div>
      </div>
      
      {/* Task Steps */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex flex-col space-y-4">
          {/* Task 1 */}
          <div 
            className={`flex items-center p-3 rounded-lg ${activeTask === 1 ? 'bg-blue-500/10 border border-blue-500/30' : completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'} transition-colors cursor-pointer`}
            onClick={() => setActiveTask(1)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${completed ? 'bg-green-500' : activeTask === 1 ? 'bg-blue-500' : 'bg-gray-700'} text-white mr-3`}>
              {completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs">1</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Follow SolQuest on Twitter</h3>
              <p className="text-xs text-gray-400 mt-1">Stay updated with news and announcements</p>
            </div>
            <div className="ml-2">
              {completed ? (
                <span className="text-xs text-green-400">Completed</span>
              ) : started ? (
                <span className="text-xs text-yellow-400">In Progress</span>
              ) : (
                <span className="text-xs text-blue-400">Start</span>
              )}
            </div>
          </div>

          {/* Task 2 */}
          <div 
            className={`flex items-center p-3 rounded-lg ${activeTask === 2 ? 'bg-blue-500/10 border border-blue-500/30' : progress >= 50 && completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'} ${!started && 'opacity-60 cursor-not-allowed'} transition-colors ${started ? 'cursor-pointer' : ''}`}
            onClick={() => started && setActiveTask(2)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${progress >= 50 && completed ? 'bg-green-500' : activeTask === 2 ? 'bg-blue-500' : 'bg-gray-700'} text-white mr-3`}>
              {progress >= 50 && completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs">2</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Verify Follow</h3>
              <p className="text-xs text-gray-400 mt-1">Verify that you've followed SolQuest</p>
            </div>
            <div className="ml-2">
              {!started ? (
                <span className="text-xs text-gray-500">Locked</span>
              ) : completed ? (
                <span className="text-xs text-green-400">Completed</span>
              ) : (
                <span className="text-xs text-blue-400">Verify</span>
              )}
            </div>
          </div>

          {/* Task 3 */}
          <div 
            className={`flex items-center p-3 rounded-lg ${activeTask === 3 ? 'bg-blue-500/10 border border-blue-500/30' : completed ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'} ${!completed && 'opacity-60 cursor-not-allowed'} transition-colors ${completed ? 'cursor-pointer' : ''}`}
            onClick={() => completed && setActiveTask(3)}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${completed && activeTask === 3 ? 'bg-green-500' : activeTask === 3 ? 'bg-blue-500' : 'bg-gray-700'} text-white mr-3`}>
              <span className="text-xs">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Claim Your Rewards</h3>
              <p className="text-xs text-gray-400 mt-1">Get points for completing this quest</p>
            </div>
            <div className="ml-2">
              {!completed ? (
                <span className="text-xs text-gray-500">Locked</span>
              ) : (
                <span className="text-xs text-blue-400">Claim</span>
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
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                  <span>Follow on Twitter</span>
                )}
              </button>
            )}
            
            {activeTask === 2 && (
              <button
                onClick={handleVerifyQuest}
                disabled={loading || !connected || !isAuthenticated || !started || completed}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                  <span>Verify Twitter Follow</span>
                )}
              </button>
            )}
            
            {activeTask === 3 && (
              <button
                onClick={() => alert('Rewards claimed!')}
                disabled={loading || !connected || !isAuthenticated || !completed}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
            <p className="text-xs text-green-300/70 mt-1">You've earned {xpReward} points</p>
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

export default TwitterFollowQuest;
