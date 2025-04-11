import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useSolanaWallet from '../hooks/useWallet';

const Leaderboard = () => {
  const { connected } = useWallet();
  const { formatWalletAddress } = useSolanaWallet();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('monthly'); // 'weekly', 'monthly', 'allTime'
  const [userRank, setUserRank] = useState(null);
  
  useEffect(() => {
    fetchLeaderboardData();
  }, [timeFrame]);
  
  const fetchLeaderboardData = () => {
    setIsLoading(true);
    
    // Mock data - in a real app, this would be fetched from the backend
    setTimeout(() => {
      const mockData = generateMockLeaderboardData();
      setLeaderboardData(mockData);
      
      // Find user's rank if connected
      if (connected) {
        const userAddress = "YourWalletAddressHere"; // This would be the actual user's address
        const userPosition = mockData.findIndex(item => item.address === userAddress);
        if (userPosition !== -1) {
          setUserRank({
            position: userPosition + 1,
            points: mockData[userPosition].points,
            rewards: mockData[userPosition].rewards
          });
        } else {
          // Add mock user data if not in top 100
          setUserRank({
            position: Math.floor(Math.random() * 900) + 100, // Random position outside top 100
            points: Math.floor(Math.random() * 500) + 100,
            rewards: "0.05 SOL"
          });
        }
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const generateMockLeaderboardData = () => {
    const data = [];
    const names = [
      "Solana Samurai", "Crypto Crusader", "Blockchain Bard", "NFT Ninja", 
      "DeFi Dynamo", "Token Titan", "Wallet Wizard", "Hash Hero",
      "Ledger Legend", "Mining Maestro", "Stake Sultan", "Yield Yoda",
      "Crypto Cat", "Block Beast", "Chain Champion", "Dapp Developer",
      "Ether Eagle", "Finality Fox", "Gas Giant", "Hodl Hedgehog"
    ];
    
    for (let i = 0; i < 100; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAddress = `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;
      
      // Points decrease as rank decreases, with some randomness
      const basePoints = 10000 - (i * 80);
      const randomVariation = Math.floor(Math.random() * 200) - 100;
      const points = Math.max(basePoints + randomVariation, 100);
      
      // Rewards calculation - Total pool: 20 SOL
      let rewards = "0 SOL";
      if (i === 0) {
        // 1st place: 5 SOL
        rewards = "5.00 SOL";
      } else if (i === 1) {
        // 2nd place: 3 SOL
        rewards = "3.00 SOL";
      } else if (i === 2) {
        // 3rd place: 2 SOL
        rewards = "2.00 SOL";
      } else if (i < 20) {
        // Remaining 17 players share 10 SOL (approximately 0.59 SOL each)
        rewards = "0.59 SOL";
      }
      
      data.push({
        rank: i + 1,
        name: randomName,
        address: i === 0 ? "YourWalletAddressHere" : randomAddress, // Make first place the user for demo
        points: points,
        rewards: rewards
      });
    }
    
    return data;
  };
  
  const getRewardPool = () => {
    return timeFrame === 'monthly' ? '20 SOL' : timeFrame === 'weekly' ? '5 SOL' : '50 SOL';
  };
  
  const getTimeFrameLabel = () => {
    return timeFrame === 'monthly' ? 'Monthly' : timeFrame === 'weekly' ? 'Weekly' : 'All Time';
  };
  
  const getTimeRemaining = () => {
    const now = new Date();
    let endDate;
    
    if (timeFrame === 'monthly') {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (timeFrame === 'weekly') {
      const daysUntilSunday = 7 - now.getDay();
      endDate = new Date(now);
      endDate.setDate(now.getDate() + daysUntilSunday);
    } else {
      return 'Ongoing';
    }
    
    const diffTime = Math.abs(endDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days remaining`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">
            Complete quests and earn points to climb the ranks and win SOL rewards
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-dark-card rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Reward Pool</div>
          <div className="text-xl font-bold text-solana-green">{getRewardPool()}</div>
          <div className="text-xs text-gray-500">{getTimeRemaining()}</div>
        </div>
      </div>
      
      <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeFrame('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFrame === 'weekly'
                  ? 'bg-solana-purple text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeFrame('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFrame === 'monthly'
                  ? 'bg-solana-purple text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeFrame('allTime')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFrame === 'allTime'
                  ? 'bg-solana-purple text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-green"></div>
          </div>
        ) : (
          <>
            {/* User's position if connected */}
            {connected && userRank && (
              <div className="bg-gradient-to-r from-solana-purple/20 to-solana-green/20 p-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-12 text-center">
                    <div className="text-lg font-bold text-white">#{userRank.position}</div>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-4">
                    <span className="text-lg font-bold text-white">You</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Your Position</div>
                    <div className="text-sm text-gray-400">{formatWalletAddress("YourWalletAddressHere")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{userRank.points.toLocaleString()} pts</div>
                    <div className="text-sm text-solana-green">{userRank.rewards}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Leaderboard table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="p-4 w-16">Rank</th>
                    <th className="p-4">User</th>
                    <th className="p-4 text-right">Points</th>
                    <th className="p-4 text-right">Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.slice(0, 20).map((user, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-700 hover:bg-gray-800 ${
                        user.address === "YourWalletAddressHere" ? "bg-solana-purple/10" : ""
                      }`}
                    >
                      <td className="p-4">
                        {index === 0 ? (
                          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            <span className="text-black font-bold">1</span>
                          </div>
                        ) : index === 1 ? (
                          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                            <span className="text-black font-bold">2</span>
                          </div>
                        ) : index === 2 ? (
                          <div className="w-8 h-8 rounded-full bg-yellow-700 flex items-center justify-center">
                            <span className="text-black font-bold">3</span>
                          </div>
                        ) : (
                          <span className="text-gray-300">{index + 1}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.address}</div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-white">{user.points.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${
                          user.rewards !== "0 SOL" ? "text-solana-green" : "text-gray-400"
                        }`}>
                          {user.rewards}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 text-center text-gray-400 text-sm">
              Top 20 users shown • {getTimeFrameLabel()} leaderboard
            </div>
          </>
        )}
      </div>
      
      <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-solana-purple text-2xl font-bold mb-2">1</div>
              <h3 className="text-white font-medium mb-2">Complete Quests</h3>
              <p className="text-gray-400 text-sm">
                Earn points by completing quests, daily check-ins, and community activities
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-solana-purple text-2xl font-bold mb-2">2</div>
              <h3 className="text-white font-medium mb-2">Climb the Ranks</h3>
              <p className="text-gray-400 text-sm">
                Compete with other users to reach the top of the leaderboard
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-solana-purple text-2xl font-bold mb-2">3</div>
              <h3 className="text-white font-medium mb-2">Win Rewards</h3>
              <p className="text-gray-400 text-sm">
                Top 20 users each month share a prize pool of 20 SOL in rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
