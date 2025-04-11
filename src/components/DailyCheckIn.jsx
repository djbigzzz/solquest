import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import confetti from 'canvas-confetti';

const DailyCheckIn = () => {
  const { connected } = useWallet();
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  
  useEffect(() => {
    if (connected) {
      // In a real app, this would be fetched from the backend
      const storedLastCheckIn = localStorage.getItem('lastCheckIn');
      const storedStreak = localStorage.getItem('checkInStreak');
      
      if (storedLastCheckIn) {
        setLastCheckIn(new Date(storedLastCheckIn));
        
        // Check if last check-in was yesterday or earlier
        const today = new Date();
        const lastCheck = new Date(storedLastCheckIn);
        const timeDiff = today.getTime() - lastCheck.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff >= 1) {
          setCanCheckIn(true);
        }
      } else {
        setCanCheckIn(true);
      }
      
      if (storedStreak) {
        setStreak(parseInt(storedStreak));
      }
    }
  }, [connected]);
  
  const handleCheckIn = () => {
    if (!canCheckIn || !connected) return;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if last check-in was yesterday to maintain streak
    let newStreak = streak;
    if (lastCheckIn) {
      const lastCheck = new Date(lastCheckIn);
      if (lastCheck.toDateString() === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastCheck.toDateString() !== today.toDateString()) {
        // If not yesterday and not today, reset streak
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    
    // Save to localStorage (in a real app, this would be saved to the backend)
    localStorage.setItem('lastCheckIn', today.toISOString());
    localStorage.setItem('checkInStreak', newStreak.toString());
    
    setLastCheckIn(today);
    setStreak(newStreak);
    setCanCheckIn(false);
    setShowReward(true);
    
    // Celebration animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Hide reward after 3 seconds
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };
  
  const getRewardAmount = () => {
    // Base points + bonus for streak
    const basePoints = 10;
    const streakBonus = Math.min(streak * 2, 20); // Cap at +20 bonus
    return basePoints + streakBonus;
  };
  
  const getXPAmount = () => {
    // Base XP + bonus for streak
    const baseXP = 5;
    const streakBonus = Math.min(streak, 15); // Cap at +15 bonus
    return baseXP + streakBonus;
  };
  
  if (!connected) {
    return (
      <div className="bg-dark-card rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Daily Check-In</h3>
        <p className="text-gray-400 mb-4">Connect your wallet to claim daily rewards</p>
      </div>
    );
  }
  
  return (
    <div className="bg-dark-card rounded-lg p-4 mb-4 relative overflow-hidden">
      {showReward && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Daily Reward Claimed!</h3>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="bg-solana-purple/30 rounded-lg px-4 py-2">
                <span className="text-solana-purple font-bold text-xl">+{getRewardAmount()}</span>
                <p className="text-gray-300 text-sm">Points</p>
              </div>
              <div className="bg-solana-green/30 rounded-lg px-4 py-2">
                <span className="text-solana-green font-bold text-xl">+{getXPAmount()}</span>
                <p className="text-gray-300 text-sm">XP</p>
              </div>
            </div>
            <p className="text-gray-400">
              {streak > 1 ? `${streak} day streak! 🔥` : 'Come back tomorrow for a streak bonus!'}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Daily Check-In</h3>
          <p className="text-gray-400 text-sm mb-3">
            Check in daily to earn points and XP
          </p>
          {streak > 0 && (
            <div className="flex items-center mb-3">
              <span className="text-yellow-500 mr-2">🔥</span>
              <span className="text-gray-300">{streak} day streak</span>
            </div>
          )}
        </div>
        <button
          onClick={handleCheckIn}
          disabled={!canCheckIn}
          className={`px-4 py-2 rounded-lg font-medium ${
            canCheckIn
              ? 'bg-solana-green text-black hover:bg-solana-green-light'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          } transition-colors`}
        >
          {canCheckIn ? 'Check In' : 'Checked In'}
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          {canCheckIn
            ? 'Claim your daily rewards now!'
            : `Next check-in available ${lastCheckIn ? 'tomorrow' : 'in 24 hours'}`}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
