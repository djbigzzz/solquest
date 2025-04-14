import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import useSolanaWallet from '../hooks/useWallet';
import useQuests from '../hooks/useQuests';
import useAuth from '../hooks/useAuth';
import QuestSubtask from '../components/QuestSubtask';
import confetti from 'canvas-confetti';

// Import for fallback image
import solanaBasicsImg from '../assets/images/solana-basics.svg';



const QuestDetail = () => {
  const { questId } = useParams();
  const [quest, setQuest] = useState(null);
  const { connected, publicKey } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const { formatWalletAddress } = useSolanaWallet();
  const [subtasks, setSubtasks] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: '' });
  const [retryCount, setRetryCount] = useState(0);
  
  // Use our custom hook for quests data
  const {
    loading: isLoading,
    error,
    fetchQuestById,
    startQuest,
    completeQuestStep
  } = useQuests();

  useEffect(() => {
    const loadQuestData = async () => {
      try {
        // Map old quest IDs to new ones for backward compatibility
        const idMap = {
          'quest-1': 'defi-explorer',
          'quest-2': 'nft-creation',
          'quest-3': 'staking-basics'
        };
        
        const mappedQuestId = idMap[questId] || questId;
        
        // Fetch quest data from the API
        const questData = await fetchQuestById(mappedQuestId);
        
        if (questData) {
          setQuest(questData);
          setSubtasks(questData.subtasks || []);
          setApiStatus({ connected: true, message: 'Connected to SolQuest API' });
        } else {
          setApiStatus({ 
            connected: false, 
            message: 'Quest not found. Using cached data if available.' 
          });
        }
      } catch (err) {
        console.error('Failed to fetch quest details:', err);
        setApiStatus({ 
          connected: false, 
          message: 'Unable to connect to SolQuest API. Using cached data.' 
        });
        
        // If we have retries left and no quest data, try again in 3 seconds
        if (retryCount < 3 && !quest) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            // This will trigger the effect to run again
          }, 3000);
        }
      }
    };
    
    loadQuestData();
  }, [questId, fetchQuestById, retryCount, quest]);

  const handleSubtaskComplete = async (subtaskId) => {
    if (!connected || !isAuthenticated) {
      alert('Please connect your wallet and sign in to complete this subtask');
      return;
    }

    try {
      // Send completion data to the backend
      const result = await completeQuestStep(quest.id, subtaskId, {
        walletAddress: publicKey.toString(),
        timestamp: new Date().toISOString()
      });
      
      if (result && result.success) {
        // Update local state to reflect completion
        setSubtasks(prevSubtasks => 
          prevSubtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: true } : subtask
          )
        );
        
        // Update progress after subtask completion
        setTimeout(() => {
          const updatedProgress = calculateProgress();
          if (updatedProgress === 100) {
            showCelebration();
          }
        }, 100);
        
        // Show offline mode notification if applicable
        if (result.offline) {
          alert('Your progress has been saved locally. It will be synchronized with the server when you reconnect.');
        }
      }
    } catch (err) {
      console.error('Error completing subtask:', err);
      alert('Failed to complete subtask. Please try again.');
    }
  };
  

  // Function to show celebration animation
  const showCelebration = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const calculateProgress = () => {
    if (!subtasks.length) return 0;
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };

  const totalXP = subtasks.reduce((sum, subtask) => sum + (subtask.completed ? subtask.xp : 0), 0);
  const progress = calculateProgress();
  const allCompleted = progress === 100;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/quests" className="text-solana-purple hover:text-solana-green mb-4 inline-block">
          ← Back to Quests
        </Link>
        
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple mb-4"></div>
          <p className="text-gray-400">Loading quest details...</p>
        </div>
      </div>
    );
  }

  if (error && !quest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/quests" className="text-solana-purple hover:text-solana-green mb-4 inline-block">
          ← Back to Quests
        </Link>
        
        <div className="bg-dark-card rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-red-400">Error Loading Quest</h2>
          <p className="mb-4 text-gray-300">{error.message || 'Failed to connect to the SolQuest API'}</p>
          <p className="mb-4 text-gray-400 text-sm">No cached data is available for this quest. Please check your internet connection.</p>
          <button 
            onClick={() => setRetryCount(prev => prev + 1)}
            className="bg-solana-purple text-white px-4 py-2 rounded-lg hover:bg-solana-purple/80 mr-4"
          >
            Try Again
          </button>
          <Link to="/quests" className="text-solana-purple hover:text-solana-green">
            Back to Quests
          </Link>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/quests" className="text-solana-purple hover:text-solana-green mb-4 inline-block">
          ← Back to Quests
        </Link>
        
        <div className="bg-dark-card rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Quest not found</h2>
          <p className="mb-4">The quest you're looking for doesn't exist.</p>
          <Link to="/quests" className="text-solana-purple hover:text-solana-green">
            Back to Quests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/quests" className="text-solana-purple hover:text-solana-green mb-4 inline-block">
        ← Back to Quests
      </Link>
      
      {/* API Status Banner */}
      {!apiStatus.connected && (
        <div className="mb-4 p-3 bg-yellow-800/50 border border-yellow-700 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-yellow-200">{apiStatus.message}</span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-yellow-200/70">You're viewing previously loaded data. Some features may be limited.</span>
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="text-xs bg-yellow-700 hover:bg-yellow-600 text-white px-2 py-1 rounded"
            >
              Try Reconnecting
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-dark-card rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="relative">
          <img 
            src={quest.image || solanaBasicsImg} 
            alt={quest.title} 
            className="w-full h-48 md:h-64 object-cover"
          />
          {quest.featured && (
            <div className="absolute top-0 right-0 bg-solana-green text-white text-xs font-bold px-2 py-1 m-4 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-white">{quest.title}</h1>
                {!apiStatus.connected && (
                  <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    Cached Data
                  </span>
                )}
              </div>
              <p className="text-gray-300 mb-4">{quest.description}</p>
              {quest.partner && (
                <div className="flex items-center mb-4">
                  <p className="text-gray-400 mr-2">Partner:</p>
                  <div className="flex items-center">
                    <img 
                      src={quest.partner.logo} 
                      alt={quest.partner.name} 
                      className="w-6 h-6 rounded-full mr-2" 
                    />
                    <a 
                      href={quest.partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solana-green hover:text-solana-green-light transition-colors"
                    >
                      {quest.partner.name}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-solana-purple to-solana-green text-white px-4 py-2 rounded-lg">
              Reward: {quest.reward}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Progress: {progress}%</span>
              <span className="text-gray-300">XP Earned: {totalXP}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-solana-purple to-solana-green h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-2">Subtasks</h2>
            
            {subtasks.map((subtask) => (
              <div key={subtask.id}>
                <QuestSubtask 
                  subtask={subtask} 
                  onComplete={handleSubtaskComplete}
                />
                {subtask.socialLink && !subtask.completed && (
                  <div className="mt-2 ml-8 mb-4">
                    <a 
                      href={subtask.socialLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solana-purple hover:text-solana-green text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit to complete this task
                    </a>
                  </div>
                )}
                {subtask.nftLink && !subtask.completed && (
                  <div className="mt-2 ml-8 mb-4">
                    <a 
                      href={subtask.nftLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-solana-purple hover:text-solana-green text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Purchase NFT
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700">
          {allCompleted ? (
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-white">All subtasks completed!</h3>
                <p className="text-gray-400 text-sm">You've earned {quest.reward}</p>
                {quest.id === 'solquest-project' && (
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-4 w-4 rounded-full bg-solana-green mr-2"></span>
                    <span className="text-solana-green text-xs">Includes exclusive NFT reward!</span>
                  </div>
                )}
              </div>
              <button 
                className="bg-gradient-to-r from-solana-purple to-solana-green text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-full md:w-auto"
                onClick={async () => {
                  if (!connected || !isAuthenticated) {
                    alert('Please connect your wallet and sign in to claim your reward');
                    return;
                  }
                  
                  if (!apiStatus.connected) {
                    alert('You are currently in offline mode. Please reconnect to the internet to claim your reward.');
                    return;
                  }
                  
                  try {
                    // In a real implementation, this would call the API to claim the reward
                    if (quest.id === 'solquest-project') {
                      alert(`Congratulations! You've earned ${quest.reward.split(' + ')[0]} SOL and an exclusive SolQuest NFT has been sent to your wallet!`);
                    } else {
                      alert(`Reward of ${quest.reward} has been sent to your wallet!`);
                    }
                  } catch (err) {
                    console.error('Error claiming reward:', err);
                    alert('Failed to claim reward. Please try again.');
                  }
                }}
              >
                Claim Reward
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-white">Complete all subtasks to earn your reward</h3>
                <p className="text-gray-400 text-sm">{progress}% complete</p>
                {quest.id === 'solquest-project' && (
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-4 w-4 rounded-full bg-purple-400 mr-2"></span>
                    <span className="text-purple-400 text-xs">Includes exclusive NFT reward!</span>
                  </div>
                )}
              </div>
              <button 
                className="bg-gray-700 text-gray-300 px-6 py-3 rounded-lg cursor-not-allowed w-full md:w-auto"
                disabled
              >
                Claim Reward
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
