import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useAuth from '../hooks/useAuth';
import SuccessModal from './SuccessModal';
import { progressAPI } from '../services/api';
import twitterLogo from '../assets/images/twitter-logo.svg';

const TwitterFollowQuest = () => {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [questStarted, setQuestStarted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  
  // Check if wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true);
      
      // If user is authenticated, fetch progress from API
      if (isAuthenticated) {
        const fetchProgress = async () => {
          try {
            const progress = await progressAPI.getUserProgress();
            setQuestStarted(progress.twitterQuestStarted || false);
            setCompleted(progress.twitterQuestCompleted || false);
          } catch (error) {
            console.error('Error fetching Twitter quest progress:', error);
          }
        };
        
        fetchProgress();
      }
    } else {
      setWalletConnected(false);
    }
  }, [connected, publicKey, isAuthenticated]);

  // Function to start Twitter follow quest
  const handleStartQuest = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Open Twitter in a new tab
    window.open('https://twitter.com/solquest', '_blank');
    setQuestStarted(true);
    
    // Save progress to API if authenticated
    if (isAuthenticated) {
      try {
        await progressAPI.updateTwitterQuest({ started: true, completed: false });
      } catch (error) {
        console.error('Error updating Twitter quest progress:', error);
      }
    }
  };
  
  // Function to validate Twitter follow
  const handleValidateQuest = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!questStarted) {
      alert('Please start the quest first by clicking the Follow button');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to verify Twitter follow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate quest completion
      setCompleted(true);
      setPointsEarned(100);
      setShowSuccessModal(true);
      
      // Save completed status to API if authenticated
      if (isAuthenticated) {
        try {
          await progressAPI.updateTwitterQuest({ started: true, completed: true });
        } catch (error) {
          console.error('Error updating Twitter quest completion:', error);
        }
      }
    } catch (error) {
      console.error('Error validating Twitter follow:', error);
      alert('Failed to validate the quest. Please try again.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg max-w-md mx-auto">
      <div className="relative h-40 bg-gradient-to-r from-blue-400 to-blue-600">
        <img 
          src={twitterLogo} 
          alt="Twitter Logo" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
        />
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Follow SolQuest on Twitter</h2>
        <p className="text-gray-300 mb-4">
          Follow SolQuest on Twitter to stay updated with the latest news and announcements about our platform and ecosystem.
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-sm text-white/60 flex items-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              100 XP
            </span>
            <span className="text-sm text-white/60 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              0.01 SOL
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="relative w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <div className="text-xs font-semibold">{completed ? '100%' : '0%'}</div>
              <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#5d5fef"
                  strokeWidth="3"
                  strokeDasharray={`${completed ? 100 : 0}, 100`}
                  className="stroke-current text-solana-purple"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            className={`w-full ${questStarted ? 'bg-blue-700' : 'bg-blue-500'} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center`}
            onClick={handleStartQuest}
            disabled={loading || completed || !walletConnected}
          >
            {questStarted ? (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Followed on Twitter
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Follow on Twitter
              </>
            )}
          </button>
          
          <button 
            className={`w-full ${completed ? 'bg-green-500' : 'bg-purple-600'} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center`}
            onClick={handleValidateQuest}
            disabled={loading || completed || !walletConnected || !questStarted}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validating...
              </>
            ) : completed ? (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Validated
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validate Follow
              </>
            )}
          </button>
        </div>
        
        {showSuccessModal && (
          <SuccessModal 
            title="Twitter Follow Completed!"
            message={`Congratulations! You've successfully followed SolQuest on Twitter and earned ${pointsEarned} points!`}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TwitterFollowQuest;
