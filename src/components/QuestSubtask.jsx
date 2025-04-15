import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const QuestSubtask = ({ subtask, onStart, onComplete }) => {
  const { id, title, description, xp, completed, started } = subtask;
  const { connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(started || false);
  const [isCompleted, setIsCompleted] = useState(completed);
  
  const handleStart = async () => {
    if (!connected) {
      alert('Please connect your wallet to start this subtask');
      return;
    }
    setIsLoading(true);
    // Simulate API call to start subtask
    setTimeout(() => {
      setIsStarted(true);
      setIsLoading(false);
      if (onStart) {
        onStart(id);
      }
    }, 1000);
  };

  const handleComplete = async () => {
    if (!connected) {
      alert('Please connect your wallet to complete this subtask');
      return;
    }
    setIsLoading(true);
    // Simulate API call to complete subtask
    setTimeout(() => {
      setIsCompleted(true);
      setIsLoading(false);
      if (onComplete) {
        onComplete(id);
      }
    }, 1500);
  };
  
  return (
    <div 
      className={`border ${isCompleted ? 'border-solana-green bg-opacity-10 bg-solana-green' : 'border-gray-700'} rounded-lg p-4 transition-colors duration-300`}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center">
            {isCompleted ? (
              <div className="h-5 w-5 rounded-full bg-solana-green flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-500 mr-3"></div>
            )}
            <h3 className="font-medium text-white">{title}</h3>
          </div>
          <p className="text-gray-400 text-sm ml-8">{description}</p>
          <div className="text-xs text-gray-500 mt-1 ml-8">+{xp} XP</div>
        </div>
        
        {isCompleted ? (
          <div className="bg-solana-green text-white text-sm px-3 py-1 rounded-full">
            Completed
          </div>
        ) : !isStarted ? (
          <button
            onClick={handleStart}
            className="bg-solana-green hover:bg-opacity-80 text-white text-sm px-3 py-1 rounded-full transition-colors"
            disabled={!connected || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting
              </span>
            ) : (
              'Start'
            )}
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="bg-solana-purple hover:bg-opacity-80 text-white text-sm px-3 py-1 rounded-full transition-colors"
            disabled={!connected || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              'Complete'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestSubtask;
