import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSolanaWallet from '../hooks/useWallet';
import useQuests from '../hooks/useQuests';
import useAuth from '../hooks/useAuth';
import { Connection, clusterApiUrl, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

function QuestCard({ quest }) {
  const { id, title, description, reward, xp, progress, image, category, featured, hasNFT, partner } = quest;
  const { connected, publicKey, sendTransaction } = useSolanaWallet();
  const { isAuthenticated } = useAuth();
  const { startQuest, completeQuest, loading } = useQuests();
  const [isLoading, setIsLoading] = useState(false);
  const [userProgress, setUserProgress] = useState(progress || 0);
  
  // Sync loading state with the useQuests hook
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  
  // Function to start or continue a quest
  const handleQuestAction = async () => {
    if (!connected || !isAuthenticated) {
      alert('Please connect your wallet and sign in to start this quest');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // If quest is already in progress, update progress
      if (userProgress > 0 && userProgress < 100) {
        // Try to complete the quest via the API
        const result = await completeQuest(id, {
          walletAddress: publicKey.toString(),
          timestamp: new Date().toISOString()
        });
        
        if (result && result.success) {
          const newProgress = Math.min(userProgress + 25, 100);
          setUserProgress(newProgress);
          
          // If quest is completed, handle reward payout
          if (newProgress === 100) {
            simulateRewardPayout();
          }
        }
      } else {
        // Start a new quest via the API
        const result = await startQuest(id, {
          walletAddress: publicKey.toString(),
          timestamp: new Date().toISOString()
        });
        
        if (result && result.success) {
          setUserProgress(25);
        }
      }
    } catch (error) {
      console.error('Error with quest action:', error);
      alert('Failed to perform quest action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reward payout to the user's wallet
  const simulateRewardPayout = async () => {
    if (id === 'solquest-project') {
      alert(`Congratulations! You've completed the "${title}" quest and earned ${reward.split(' + ')[0]} SOL and an exclusive NFT!`);
    } else {
      alert(`Congratulations! You've completed the "${title}" quest and earned ${reward}!`);
    }
    
    // In a real implementation, this would create and send an actual transaction
    // For demo purposes, we're just showing what it would look like
    /*
    try {
      // This would be integrated with the backend API to trigger the reward
      // For now, we're just simulating the transaction
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: TREASURY_WALLET, // Would be defined elsewhere
          toPubkey: publicKey,
          lamports: reward * LAMPORTS_PER_SOL
        })
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Reward transaction confirmed:', signature);
    } catch (error) {
      console.error('Error sending reward:', error);
    }
    */
  };
  
  return (
    <div className="quest-card group bg-card-bg rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Banner Image */}
      <Link to={`/quest/${id}`}>
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {featured && (
            <div className="absolute top-0 right-0 bg-solana-green text-white text-xs font-bold px-2 py-1 m-2 rounded">
              Featured
            </div>
          )}
          {userProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div 
                className="h-full bg-solana-purple" 
                style={{ width: `${userProgress}%` }}
              />
            </div>
          )}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="bg-card-tag text-xs font-medium text-white px-2 py-1 rounded">{category}</span>
        </div>
        
        {partner && (
          <div className="flex items-center mb-2">
            <span className="text-xs text-gray-400 mr-1">Partner:</span>
            <div className="flex items-center">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="w-4 h-4 rounded-full mr-1" 
              />
              <span className="text-xs text-solana-green">{partner.name}</span>
            </div>
          </div>
        )}
        
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-start">
          <div className="bg-solana-purple/20 text-solana-purple px-2 py-1 rounded text-sm font-medium">
            {reward}
            {id === 'solquest-project' && (
              <span className="flex items-center mt-1 text-xs text-solana-green">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                + NFT
              </span>
            )}
          </div>
        </div>
        
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <div className="text-xs font-semibold">{userProgress}%</div>
              <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#5d5fef"
                  strokeWidth="3"
                  strokeDasharray={`${userProgress}, 100`}
                  className="stroke-current text-solana-purple"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white/60 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {xp} XP
              </span>
              <span className="text-xs text-white/60 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {category}
              </span>
            </div>
          </div>
          
          <button 
            className={`${userProgress === 100 ? 'bg-solana-green' : userProgress > 0 ? 'bg-solana-purple' : 'bg-gradient-to-r from-solana-purple to-solana-green'} text-sm py-1.5 px-4 rounded-lg flex items-center hover:opacity-90 transition-opacity`}
            onClick={handleQuestAction}
            disabled={isLoading || userProgress === 100}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </>
            ) : userProgress === 100 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed
              </>
            ) : userProgress > 0 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Quest
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestCard;
