import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useAuth from '../hooks/useAuth';
import SuccessModal from './SuccessModal';
import { progressAPI } from '../services/api';

const NFTMintQuest = () => {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);
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
            setQuestStarted(progress.nftQuestStarted || false);
            setCompleted(progress.nftQuestCompleted || false);
            
            // Set mint progress to 100 if completed, otherwise 0 or 10 if started
            if (progress.nftQuestCompleted) {
              setMintProgress(100);
            } else if (progress.nftQuestStarted) {
              setMintProgress(10);
            }
          } catch (error) {
            console.error('Error fetching NFT quest progress:', error);
          }
        };
        
        fetchProgress();
      }
    } else {
      setWalletConnected(false);
    }
  }, [connected, publicKey, isAuthenticated]);

  // Function to start NFT minting quest
  const handleStartQuest = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setQuestStarted(true);
    setMintProgress(10); // Show some initial progress
    
    // Save progress to API if authenticated
    if (isAuthenticated) {
      try {
        await progressAPI.updateNFTQuest({ started: true, completed: false });
      } catch (error) {
        console.error('Error updating NFT quest progress:', error);
      }
    }
  };
  
  // Function to validate NFT minting
  const handleValidateQuest = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!questStarted) {
      alert('Please start the quest first by clicking the Mint button');
      return;
    }

    setLoading(true);

    try {
      // Simulate minting process with progress updates
      for (let i = 20; i <= 100; i += 10) {
        setMintProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Simulate quest completion
      setCompleted(true);
      setPointsEarned(400);
      setShowSuccessModal(true);
      
      // Save completed status to API if authenticated
      if (isAuthenticated) {
        try {
          await progressAPI.updateNFTQuest({ started: true, completed: true });
        } catch (error) {
          console.error('Error updating NFT quest completion:', error);
        }
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-40 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-bold text-white">SolQuest OG NFT</div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Mint SolQuest OG NFT</h2>
        <p className="text-gray-300 mb-4">
          Mint the exclusive SolQuest OG NFT. Only 10,000 will ever be minted, making this a rare collectible in the Solana ecosystem.
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-purple-400">Reward: 400 XP + NFT</span>
          <span className="text-sm font-medium text-pink-400">{mintProgress}% Complete</span>
        </div>
        
        <div className="flex items-center mb-2">
          <span className="text-sm text-white/60 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            400 XP
          </span>
        </div>
        
        <div className="w-full mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white font-medium text-sm">Progress:</span>
            <span className="text-white text-sm">{mintProgress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
              style={{ width: `${mintProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            className={`w-full ${questStarted ? 'bg-purple-700' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center`}
            onClick={handleStartQuest}
            disabled={loading || completed || !walletConnected || questStarted}
          >
            {questStarted ? (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mint Started
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Minting
              </>
            )}
          </button>
          
          <button 
            className={`w-full ${completed ? 'bg-green-500' : 'bg-indigo-600'} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center`}
            onClick={handleValidateQuest}
            disabled={loading || completed || !walletConnected || !questStarted}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finalizing Mint... {mintProgress}%
              </>
            ) : completed ? (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mint Validated
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validate Mint
              </>
            )}
          </button>
        </div>
        
        {showSuccessModal && (
          <SuccessModal 
            title="NFT Mint Completed!"
            message={`Congratulations! You've successfully minted the SolQuest OG NFT and earned ${pointsEarned} XP!`}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NFTMintQuest;
