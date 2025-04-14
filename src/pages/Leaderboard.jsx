import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useSolanaWallet from '../hooks/useWallet';
import useLeaderboard from '../hooks/useLeaderboard';
import useAuth from '../hooks/useAuth';

const Leaderboard = () => {
  const { connected, publicKey } = useWallet();
  const { formatWalletAddress } = useSolanaWallet();
  const { isAuthenticated, user } = useAuth();
  const [timeFrame, setTimeFrame] = useState('monthly'); // 'weekly', 'monthly', 'allTime'
  const [userRank, setUserRank] = useState(null);
  
  // Use our custom hook for leaderboard data
  const {
    leaderboardData,
    loading: isLoading,
    error,
    pagination,
    fetchLeaderboard
  } = useLeaderboard();
  
  // Fetch leaderboard data when timeFrame changes
  useEffect(() => {
    // Pass timeFrame as a parameter to the API
    fetchLeaderboard(1, 20, timeFrame);
  }, [timeFrame, fetchLeaderboard]);
  
  // Set user rank when leaderboard data changes
  useEffect(() => {
    if (connected && publicKey && leaderboardData.length > 0) {
      const walletAddress = publicKey.toString();
      const userPosition = leaderboardData.findIndex(item => item.walletAddress === walletAddress);
      
      if (userPosition !== -1) {
        // User is in the leaderboard
        setUserRank({
          position: userPosition + 1,
          points: leaderboardData[userPosition].points,
          rewards: leaderboardData[userPosition].rewards || '0 SOL'
        });
      } else if (user && user.rank) {
        // User is not in top leaderboard but we have their rank from the API
        setUserRank({
          position: user.rank.position,
          points: user.rank.points,
          rewards: user.rank.rewards || '0 SOL'
        });
      } else {
        // Default case if we don't have user rank data
        setUserRank(null);
      }
    } else {
      setUserRank(null);
    }
  }, [connected, publicKey, leaderboardData, user]);
  
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
            {connected && publicKey && userRank && (
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
                    <div className="text-sm text-gray-400">{formatWalletAddress(publicKey.toString())}</div>
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
                  {leaderboardData.map((user, index) => (
                    <tr 
                      key={user.walletAddress || index} 
                      className={`border-b border-gray-700 hover:bg-gray-800 ${
                        publicKey && user.walletAddress === publicKey.toString() ? "bg-solana-purple/10" : ""
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
                        <div className="font-medium text-white">{user.username || 'Anonymous User'}</div>
                        <div className="text-sm text-gray-400">{formatWalletAddress(user.walletAddress)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-white">{user.points.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${
                          user.rewards && user.rewards !== "0 SOL" ? "text-solana-green" : "text-gray-400"
                        }`}>
                          {user.rewards || '0 SOL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 text-center text-gray-400 text-sm">
              {error ? (
                <div className="text-red-500">Error loading leaderboard data. Please try again later.</div>
              ) : (
                <>
                  Top {leaderboardData.length} users shown • {getTimeFrameLabel()} leaderboard
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-2 flex justify-center space-x-2">
                      <button 
                        onClick={() => fetchLeaderboard(Math.max(1, pagination.currentPage - 1), 20, timeFrame)}
                        disabled={pagination.currentPage <= 1}
                        className={`px-3 py-1 rounded ${pagination.currentPage <= 1 ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1">Page {pagination.currentPage} of {pagination.totalPages}</span>
                      <button 
                        onClick={() => fetchLeaderboard(Math.min(pagination.totalPages, pagination.currentPage + 1), 20, timeFrame)}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className={`px-3 py-1 rounded ${pagination.currentPage >= pagination.totalPages ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
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
