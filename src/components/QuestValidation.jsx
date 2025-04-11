import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

// Import local images
import images from '../assets/images/placeholder';

const QuestValidation = ({ quest, onComplete }) => {
  const { connected, publicKey } = useWallet();
  const [currentStep, setCurrentStep] = useState(0);
  const [showMintOption, setShowMintOption] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [streak, setStreak] = useState(localStorage.getItem('solquest-streak') ? parseInt(localStorage.getItem('solquest-streak')) : 0);
  const [lastQuestDate, setLastQuestDate] = useState(localStorage.getItem('solquest-last-quest-date') || '');
  const [comboMultiplier, setComboMultiplier] = useState(1.0);
  const [showCombo, setShowCombo] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const comboTimeout = useRef(null);

  // Start timer when component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Check for streak continuation
  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (lastQuestDate && lastQuestDate !== today) {
      if (lastQuestDate === yesterdayString) {
        // Streak continues
        const incrementStreak = () => {
          setStreak(prev => prev + 1);
          
          localStorage.setItem('solquest-streak', (streak + 1).toString());
          localStorage.setItem('solquest-last-quest-date', new Date().toDateString());
          
          // Add floating animation for streak
          addFloatingPoints(`${streak + 1} DAY STREAK!`, true, 30, 40);
          
          // Show streak milestone notifications
          if ((streak + 1) % 5 === 0) {
            toast.success(`🔥 ${streak + 1} day streak achieved! Keep it up!`, {
              duration: 5000,
              icon: '🔥'
            });
            
            // Add floating points for milestone
            addFloatingPoints('STREAK BONUS +50', true, 50, 30);
          }
        };
        
        incrementStreak();
      } else if (lastQuestDate !== today) {
        // Streak broken
        if (streak > 7) {
          toast.error(`😢 Your ${streak} day streak was broken!`);
        }
        setStreak(1);
        localStorage.setItem('solquest-streak', '1');
      }
    }
  }, [lastQuestDate, streak]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate time bonus based on completion time
  const calculateTimeBonus = () => {
    const completionTime = (Date.now() - startTime) / 1000; // in seconds
    let bonus = 0;
    let rating = '';
    let icon = '';
    
    const difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2
    };
    
    if (completionTime < 120) { // Under 2 minutes
      bonus = 50;
      rating = 'Speed Demon';
      icon = '⚡';
      
      // Add speed demon achievement
      addAchievement({
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Completed a quest in under 2 minutes',
        icon: '⚡',
        points: 50
      });
    } else if (completionTime < 300) { // Under 5 minutes
      bonus = 30;
      rating = 'Quick Learner';
      icon = '🚀';
      
      // Add quick learner achievement
      addAchievement({
        id: 'quick_learner',
        title: 'Quick Learner',
        description: 'Completed a quest in under 5 minutes',
        icon: '🚀',
        points: 30
      });
    } else if (completionTime < 600) { // Under 10 minutes
      bonus = 15;
      rating = 'Steady Pace';
      icon = '⏱️';
    }
    
    return { bonus, rating, icon };
  };

  // Calculate streak bonus
  const calculateStreakBonus = () => {
    if (streak < 3) return 0;
    
    if (streak >= 15) {
      return 100; // 15+ day streak
    } else if (streak >= 10) {
      return 75; // 10-14 day streak
    } else if (streak >= 7) {
      return 50; // 7-9 day streak
    } else if (streak >= 5) {
      return 30; // 5-6 day streak
    } else if (streak >= 3) {
      return 15; // 3-4 day streak
    }
    
    return 0;
  };

  // Add achievement
  const addAchievement = (achievement) => {
    // Check if achievement already exists
    if (!achievements.some(a => a.id === achievement.id)) {
      setAchievements(prev => [...prev, achievement]);
      
      // Display the achievement popup
      setCurrentAchievement(achievement);
      setShowAchievement(true);
      
      // Hide after animation completes
      setTimeout(() => {
        setShowAchievement(false);
      }, 3500);
      
      // Show toast notification
      toast.success(`Achievement Unlocked: ${achievement.title}`, {
        icon: achievement.icon || '🏆',
        duration: 5000
      });
      
      // Add floating points if achievement has points
      if (achievement.points) {
        addFloatingPoints(`${achievement.points} ACHIEVEMENT BONUS`, true, 40, 40);
      }
    }
  };

  // Handle quest completion
  const handleComplete = () => {
    setShowMintOption(true);
    setShowRewards(true);
    
    // Calculate bonuses
    const { bonus: timeBonus, rating, icon } = calculateTimeBonus();
    const streakBonus = calculateStreakBonus();
    
    // Apply bonuses
    if (timeBonus > 0) {
      setPointsEarned(prev => prev + timeBonus);
      addFloatingPoints(`${timeBonus} TIME BONUS`, true, 60, 40);
    }
    
    if (streakBonus > 0) {
      setPointsEarned(prev => prev + streakBonus);
      
      // Add streak achievement if significant
      if (streak >= 3) {
        addAchievement({
          id: 'streak_bonus',
          title: 'Streak Master',
          description: `${streak} day streak earned you ${streakBonus} bonus points`,
          icon: '🔥',
          points: streakBonus
        });
      }
    }
    
    // Perfect score achievement (no hints used)
    if (hintsUsed === 0) {
      addAchievement({
        id: 'no_hints',
        title: 'Solo Explorer',
        description: 'Completed a quest without using any hints',
        icon: '🧠',
        points: 25
      });
      
      setPointsEarned(prev => prev + 25); // Bonus for no hints
    }
    
    // Combo master achievement
    if (comboMultiplier >= 2.0) {
      addAchievement({
        id: 'combo_master',
        title: 'Combo Master',
        description: 'Achieved a 2x or higher combo multiplier',
        icon: '⚡',
        points: 20
      });
      
      setPointsEarned(prev => prev + 20); // Bonus for high combo
    }
    
    // Increment streak
    incrementStreak();
    
    // Trigger confetti for quest completion
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    // Call onComplete callback if provided
    onComplete && onComplete({
      points: pointsEarned,
      xp: xpEarned,
      achievements: achievements
    });
    
    toast.success('Quest completed! You can now mint your NFT.');
  };

  // Floating points animation state
  const [floatingPoints, setFloatingPoints] = useState([]);
  
  // Add floating points animation
  const addFloatingPoints = (amount, isPositive = true, x = 50, y = 50) => {
    const id = Date.now();
    const newPoint = {
      id,
      amount,
      isPositive,
      x,
      y
    };
    
    setFloatingPoints(prev => [...prev, newPoint]);
    
    // Remove after animation completes
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 1500);
  };
  
  // Trigger combo effect
  const triggerCombo = () => {
    // Clear any existing timeout
    if (comboTimeout.current) {
      clearTimeout(comboTimeout.current);
    }
    
    // Increase combo multiplier
    setComboMultiplier(prev => {
      const newMultiplier = Math.min(prev + 0.1, 3.0); // Cap at 3x
      return newMultiplier;
    });
    
    // Show combo effect
    setShowCombo(true);
    
    // Add floating points for combo
    if (comboMultiplier > 1.5) {
      addFloatingPoints(`COMBO x${comboMultiplier.toFixed(1)}!`, true, 70, 30);
    }
    
    // Hide after 5 seconds
    comboTimeout.current = setTimeout(() => {
      setShowCombo(false);
    }, 5000);
  };

  // Check for achievements
  const checkAchievements = () => {
    const newAchievements = [];
    
    availableAchievements.forEach(achievement => {
      // Check if we already have this achievement
      if (!achievements.some(a => a.id === achievement.id) && achievement.condition()) {
        newAchievements.push(achievement);
      }
    });
    
    if (newAchievements.length > 0) {
      // Add new achievements
      setAchievements(prev => [...prev, ...newAchievements]);
      
      // Show achievement popup for each new achievement
      showAchievementNotifications(newAchievements);
      
      // Add points and XP from achievements
      const additionalPoints = newAchievements.reduce((sum, a) => sum + a.points, 0);
      const additionalXP = newAchievements.reduce((sum, a) => sum + a.xp, 0);
      
      setPointsEarned(prev => prev + additionalPoints);
      setXpEarned(prev => prev + additionalXP);
      
      // Show toast notification
      toast.success(`You earned ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''}!`, {
        icon: '🏆',
        duration: 5000,
      });
    }
  };

  // Show achievement notifications one by one
  const showAchievementNotifications = (newAchievements) => {
    if (newAchievements.length === 0) return;
    
    // Show the first achievement
    setCurrentAchievement(newAchievements[0]);
    setShowAchievement(true);
    
    // Set up a timer to show the rest
    let index = 1;
    const intervalId = setInterval(() => {
      if (index >= newAchievements.length) {
        clearInterval(intervalId);
        setTimeout(() => setShowAchievement(false), 3000);
        return;
      }
      
      setCurrentAchievement(newAchievements[index]);
      index++;
    }, 3500); // Show each achievement for 3.5 seconds
  };

  // Available achievements
  const availableAchievements = [
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete a quest in under 2 minutes',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      points: 50,
      xp: 25,
      condition: () => timeSpent < 120, // 2 minutes
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 3-day streak or longer',
      icon: '🔥',
      color: 'from-red-500 to-pink-600',
      points: 75,
      xp: 40,
      condition: () => streak >= 3,
    },
    {
      id: 'combo_king',
      title: 'Combo King',
      description: 'Reach a 2x combo multiplier',
      icon: '👑',
      color: 'from-purple-500 to-indigo-600',
      points: 60,
      xp: 30,
      condition: () => comboMultiplier >= 2,
    },
    {
      id: 'no_hints',
      title: 'Solo Explorer',
      description: 'Complete a quest without using any hints',
      icon: '🧠',
      color: 'from-blue-500 to-cyan-600',
      points: 100,
      xp: 50,
      condition: () => hintsUsed === 0 && currentStep === validationSteps.length,
    },
    {
      id: 'first_quest',
      title: 'First Steps',
      description: 'Complete your first quest',
      icon: '🏆',
      color: 'from-green-500 to-emerald-600',
      points: 25,
      xp: 15,
      condition: () => currentStep === validationSteps.length,
    }
  ];

  // Simulated validation steps
  const validationSteps = [
    {
      id: 'start',
      title: 'Start Quest',
      description: 'Begin your journey with this quest',
      points: 50,
      xp: 25,
      hints: [
        "Make sure your wallet is connected before starting",
        "Click the 'Start Quest' button to begin",
        "You'll need to complete all steps to earn rewards"
      ]
    },
    {
      id: 'checkpoint1',
      title: 'Checkpoint 1',
      description: 'Complete the first task of the quest',
      points: 100,
      xp: 50,
      hints: [
        "For this step, you need to understand the basics of Solana",
        "Try exploring the documentation at solana.com",
        "Focus on understanding what makes Solana different from other blockchains"
      ]
    },
    {
      id: 'checkpoint2',
      title: 'Checkpoint 2',
      description: 'Reach the halfway point of your journey',
      points: 150,
      xp: 75,
      hints: [
        "This step requires you to understand Solana's programming model",
        "Look into how accounts and programs interact on Solana",
        "Try using the Solana Playground to experiment with simple programs"
      ]
    },
    {
      id: 'validation',
      title: 'Final Validation',
      description: 'Complete all requirements and validate your quest',
      points: 200,
      xp: 100,
      hints: [
        "Make sure you've completed all previous steps correctly",
        "Double-check your work against the quest requirements",
        "Submit your final solution for validation"
      ]
    }
  ];

  const handleStartStep = () => {
    if (!connected) {
      toast.error('Please connect your wallet to start this quest');
      return;
    }
    
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      setCurrentStep(1);
      setIsValidating(false);
      
      // Update last quest date for streak tracking
      const today = new Date().toDateString();
      setLastQuestDate(today);
      localStorage.setItem('solquest-last-quest-date', today);
      
      // Add points and XP
      setPointsEarned(prev => prev + validationSteps[0].points);
      setXpEarned(prev => prev + validationSteps[0].xp);
      
      // Trigger combo
      triggerCombo();
      
      // Trigger confetti for successful start
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast.success('Quest started! Complete all steps to earn rewards.');
    }, 1500);
  };

  const handleValidateStep = (stepIndex) => {
    if (!connected || isValidating) return;
    
    setIsValidating(true);
    
    // Reset hint state for next step
    setShowHint(false);
    setHintIndex(0);
    
    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      
      // Validation successful
      if (stepIndex === currentStep) {
        // Increment step
        setCurrentStep(prev => prev + 1);
        
        // Add points and XP
        const pointsForStep = validationSteps[stepIndex].points || 10;
        const xpForStep = validationSteps[stepIndex].xp || 5;
        
        setPointsEarned(prev => prev + pointsForStep);
        setXpEarned(prev => prev + xpForStep);
        
        // Add floating points animation
        addFloatingPoints(`${pointsForStep}`, true, 50, 50);
        
        // Trigger combo effect
        triggerCombo();
        
        // Show toast notification
        toast.success(`Step completed! +${pointsForStep} points, +${xpForStep} XP`);
        
        // Check if quest is complete
        if (stepIndex === validationSteps.length - 1) {
          handleComplete();
        }
      }
    }, 1500);
  };

  const handleMintNFT = () => {
    if (!connected || isMinting) return;
    
    setIsMinting(true);
    
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      
      // Trigger special confetti for NFT minting
      confetti({
        particleCount: 300,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#14F195', '#9945FF', '#FFFFFF']
      });
      
      // Add achievement for minting NFT
      setAchievements(prev => [
        ...prev, 
        {
          id: 'nft_minted',
          title: 'NFT Collector',
          description: 'Minted your first quest completion NFT',
          icon: '🏆'
        }
      ]);
      
      // Check if quest was completed quickly for speed achievement
      if (timeSpent < 300) { // Less than 5 minutes
        setAchievements(prev => [
          ...prev, 
          {
            id: 'speed_demon',
            title: 'Speed Demon',
            description: 'Completed a quest in under 5 minutes',
            icon: '⚡'
          }
        ]);
      }
      
      alert('Congratulations! You have minted a completion NFT for this quest.');
    }, 2000);
  };

  const toggleHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      
      // Apply hint penalty
      setPointsEarned(prev => Math.max(0, prev - 5)); // 5 points penalty
      
      // Add floating points animation for penalty
      addFloatingPoints('5', false, 80, 60);
      
      toast.success('Hint revealed! (-5 points)', { icon: '💡' });
    } else {
      setShowHint(false);
    }
  };

  const nextHint = () => {
    if (currentStep > 0 && currentStep < validationSteps.length) {
      const currentStepHints = validationSteps[currentStep].hints;
      
      if (hintIndex < currentStepHints.length - 1) {
        setHintIndex(prev => prev + 1);
        setHintsUsed(prev => prev + 1);
        
        // Apply hint penalty
        setPointsEarned(prev => Math.max(0, prev - 5)); // 5 points penalty
        
        // Add floating points animation for penalty
        addFloatingPoints('5', false, 80, 60);
      }
    }
  };

  const prevHint = () => {
    if (hintIndex > 0) {
      setHintIndex(prev => prev - 1);
    }
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
    
    // Check for streak achievements
    if (streak + 1 === 3) {
      setAchievements(prev => [
        ...prev, 
        {
          id: 'streak_master',
          title: 'Streak Master',
          description: 'Completed 3 steps in a row without taking a break',
          icon: '🔥'
        }
      ]);
    }
  };


  return (
    <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg relative">
      {/* Achievement popup */}
      {showAchievement && currentAchievement && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-solana-purple to-solana-green p-4 rounded-lg shadow-lg text-white text-center z-50 animate-achievement">
          <div className="text-4xl mb-2">{currentAchievement.icon || '🏆'}</div>
          <h3 className="text-lg font-bold mb-1">Achievement Unlocked!</h3>
          <h4 className="text-md font-semibold mb-2">{currentAchievement.title}</h4>
          <p className="text-sm mb-2">{currentAchievement.description}</p>
          {currentAchievement.points && (
            <div className="text-yellow-300 font-bold">+{currentAchievement.points} points</div>
          )}
          <div className="flex justify-center space-x-3 mt-2">
            <div className="bg-white/20 rounded-full px-2 py-1 text-white">+{currentAchievement.points || 0} pts</div>
            <div className="bg-white/20 rounded-full px-2 py-1 text-white">+{currentAchievement.xp || 0} XP</div>
          </div>
        </div>
      )}
      
      {/* Floating points animations */}
      {floatingPoints.map(point => (
        <div 
          key={point.id} 
          className="absolute animate-points z-30 pointer-events-none"
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%`,
            color: point.isPositive ? 'var(--tw-text-opacity, 1); --tw-text-opacity: 1; color: rgb(74 222 128 / var(--tw-text-opacity))' : 'rgb(248 113 113 / var(--tw-text-opacity))'
          }}
        >
          <div className="text-sm font-bold whitespace-nowrap">
            {point.isPositive ? '+' : '-'}{point.amount}
          </div>
        </div>
      ))}
      
      {/* Combo effect overlay */}
      {showCombo && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center animate-combo z-20">
          <span className="mr-1">Combo x{comboMultiplier.toFixed(1)}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Quest Validation</h2>
          
          {/* Stats display */}
          <div className="flex space-x-3">
            <div className="flex items-center text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{formatTime(timeSpent)}</span>
            </div>
            
            <div className="flex items-center text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className={`text-sm ${streak > 1 ? 'animate-streak' : ''}`}>{streak} day streak</span>
            </div>
          </div>
        </div>
        
        {/* Current progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.min(currentStep, validationSteps.length)}/{validationSteps.length} steps</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-solana-purple to-solana-green animate-progress" 
              style={{ 
                width: `${(currentStep / validationSteps.length) * 100}%`,
                '--progress-width': `${(currentStep / validationSteps.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
        
        {/* Rewards tracker */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs text-gray-400 mb-1">Points Earned</div>
              <div className="text-solana-green font-bold text-lg flex items-center">
                {pointsEarned}
                {pointsEarned > 0 && (
                  <span className="ml-1 text-xs text-gray-400">pts</span>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-solana-green/10 to-transparent"></div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs text-gray-400 mb-1">XP Gained</div>
              <div className="text-solana-purple font-bold text-lg flex items-center">
                {xpEarned}
                {xpEarned > 0 && (
                  <span className="ml-1 text-xs text-gray-400">XP</span>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-solana-purple/10 to-transparent"></div>
          </div>
        </div>
        
        {/* Current step details */}
        {currentStep < validationSteps.length ? (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {validationSteps[currentStep].title}
            </h3>
            <p className="text-gray-300 mb-4">
              {validationSteps[currentStep].description}
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-gray-900 rounded-lg px-3 py-1">
                <span className="text-xs text-gray-400">Points</span>
                <div className="text-solana-green font-bold">+{validationSteps[currentStep].points}</div>
              </div>
              <div className="bg-gray-900 rounded-lg px-3 py-1">
                <span className="text-xs text-gray-400">XP</span>
                <div className="text-solana-purple font-bold">+{validationSteps[currentStep].xp}</div>
              </div>
            </div>
            
            <button 
              onClick={currentStep === 0 ? handleStartStep : () => handleValidateStep(currentStep)}
              disabled={isValidating}
              className={`w-full py-2 rounded-lg font-bold ${
                isValidating 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-solana-green hover:bg-solana-green-light text-black'
              }`}
            >
              {isValidating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </div>
              ) : currentStep === 0 ? (
                'Start Quest'
              ) : (
                `Complete ${validationSteps[currentStep].title}`
              )}
            </button>
          </div>
        ) : showMintOption ? (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Quest Completed!</h3>
            <p className="text-gray-300 mb-4">Congratulations on completing this quest. You can now mint an NFT to commemorate your achievement.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div>
                <span className="text-xs text-gray-400">Points Earned</span>
                <div className="text-solana-green font-bold">{pointsEarned}</div>
              </div>
              <div>
                <span className="text-xs text-gray-400">XP Gained</span>
                <div className="text-solana-purple font-bold">{xpEarned}</div>
              </div>
              <div>
                <span className="text-xs text-gray-400">Time Spent</span>
                <div className="text-blue-400 font-bold">{formatTime(timeSpent)}</div>
              </div>
            </div>
            
            {/* Rewards breakdown */}
            {showRewards && (
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">Rewards Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Quest Rewards</span>
                    <span className="text-solana-green">{validationSteps.reduce((sum, step) => sum + step.points, 0)} pts</span>
                  </div>
                  
                  {streak > 1 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Streak Bonus ({streak} days)</span>
                      <span className="text-solana-green">+{calculateStreakBonus()} pts</span>
                    </div>
                  )}
                  
                  {calculateTimeBonus().bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Speed Bonus ({calculateTimeBonus().rating})</span>
                      <span className="text-solana-green">+{calculateTimeBonus().bonus} pts</span>
                    </div>
                  )}
                  
                  {comboMultiplier > 1 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Combo Multiplier</span>
                      <span className="text-solana-green">x{comboMultiplier.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {hintsUsed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hint Penalty ({hintsUsed} hints used)</span>
                      <span className="text-red-400">-{hintsUsed * 5} pts</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-700 pt-1 flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-solana-green">{pointsEarned} pts / {xpEarned} XP</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Preview NFT */}
            <div className="mb-4 flex justify-center">
              <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                <img src={images.nft} alt="NFT Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold">
                  PREVIEW
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-xs text-white font-semibold">{quest?.title || 'Quest'} Completion</div>
                  <div className="text-xs text-gray-300">SolQuest Explorer</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleMintNFT}
              disabled={isMinting}
              className={`w-full py-3 rounded-lg font-bold ${
                isMinting 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-solana-purple to-solana-green hover:from-solana-purple-light hover:to-solana-green-light text-white'
              }`}
            >
              {isMinting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Minting NFT...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mint Completion NFT (0.05 SOL)
                </div>
              )}
            </button>
            <div className="text-center text-xs text-gray-400 mt-2">
              This NFT proves you completed this quest and grants special perks
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Exclusive Access</div>
                <div className="text-white">Premium Quests</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Bonus</div>
                <div className="text-white">+5% XP Gain</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Leaderboard</div>
                <div className="text-white">Special Badge</div>
              </div>
            </div>
            
            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-white">Achievements Earned</h4>
                  <button 
                    onClick={() => setShowRewards(!showRewards)} 
                    className="text-xs text-gray-400 hover:text-white flex items-center"
                  >
                    {showRewards ? 'Hide Details' : 'Show Details'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showRewards ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {achievements.map(achievement => (
                    <div 
                      key={achievement.id}
                      className={`bg-gradient-to-r ${achievement.color} rounded-lg p-2 text-white flex flex-col items-center justify-center`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className="text-xs font-semibold text-center">{achievement.title}</div>
                      <div className="text-xs text-white/70 mt-1">+{achievement.points} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
        
        {/* Hint system */}
        {currentStep > 0 && currentStep < validationSteps.length && (
          <div className="mt-4">
            <button 
              onClick={toggleHint}
              className="text-sm text-gray-400 hover:text-solana-green flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showHint ? 'Hide Hints' : 'Need a Hint?'}
            </button>
            
            {showHint && (
              <div className="mt-2 p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg text-sm text-gray-300 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Hint for {validationSteps[currentStep].title}:</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={prevHint}
                      disabled={hintIndex === 0}
                      className={`p-1 rounded ${hintIndex === 0 ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-xs text-gray-500">{hintIndex + 1}/{validationSteps[currentStep].hints.length}</span>
                    <button 
                      onClick={nextHint}
                      disabled={hintIndex >= validationSteps[currentStep].hints.length - 1}
                      className={`p-1 rounded ${hintIndex >= validationSteps[currentStep].hints.length - 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-2 bg-black/30 rounded">
                  <p>{validationSteps[currentStep].hints[hintIndex]}</p>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                  <span>Using hints slightly reduces your points</span>
                  <span className="text-solana-green">Hint {hintIndex + 1} of {validationSteps[currentStep].hints.length}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestValidation;
