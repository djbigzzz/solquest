import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useSolanaWallet from '../hooks/useWallet';
import { Link } from 'react-router-dom';
import ReferralSystem from '../components/ReferralSystem';

const fetchProfile = async () => {
  const response = await fetch('/api/users/profile', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return await response.json();
};

const Profile = () => {
  const { connected, publicKey } = useWallet();
  const { formatWalletAddress } = useSolanaWallet();
  const [userStats, setUserStats] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (connected) {
      fetchUserData();
    }
  }, [connected]);

  const fetchUserData = () => {
    setIsLoading(true);

    // Mock data - in a real app, this would be fetched from the backend
    setTimeout(() => {
      setUserStats({
        totalXP: 1250,
        level: 12,
        questsCompleted: 8,
        totalPoints: 3450,
        rank: 42,
        joinedDate: '2025-01-15'
      });

      setUserNFTs([
        {
          id: 'solquest-explorer-1',
          name: 'SolQuest Explorer',
          image: 'https://via.placeholder.com/200x200/9945FF/FFFFFF?text=Explorer+NFT',
          description: 'Grants +30% XP and +20% SOL rewards on all quests',
          acquiredDate: '2025-03-20',
          rarity: 'Rare',
          boosts: [
            { type: 'XP', value: '+30%' },
            { type: 'SOL', value: '+20%' }
          ]
        }
      ]);

      setActivityHistory([
        {
          id: 1,
          type: 'quest_completed',
          title: 'Completed "Solana Basics" Quest',
          reward: '0.5 SOL',
          points: 250,
          xp: 150,
          timestamp: '2025-04-08T14:30:00Z'
        },
        {
          id: 2,
          type: 'nft_purchase',
          title: 'Purchased SolQuest Explorer NFT',
          cost: '1.5 SOL',
          timestamp: '2025-03-20T10:15:00Z'
        },
        {
          id: 3,
          type: 'daily_checkin',
          title: 'Daily Check-in',
          points: 15,
          xp: 10,
          streak: 3,
          timestamp: '2025-04-09T09:00:00Z'
        },
        {
          id: 4,
          type: 'quest_completed',
          title: 'Completed "DeFi Explorer" Quest',
          reward: '0.5 SOL',
          points: 200,
          xp: 120,
          timestamp: '2025-04-05T16:45:00Z'
        },
        {
          id: 5,
          type: 'daily_checkin',
          title: 'Daily Check-in',
          points: 14,
          xp: 9,
          streak: 2,
          timestamp: '2025-04-08T08:30:00Z'
        },
        {
          id: 6,
          type: 'quest_subtask',
          title: 'Completed "Create a Solana wallet" subtask',
          points: 50,
          xp: 30,
          timestamp: '2025-04-02T11:20:00Z'
        },
        {
          id: 7,
          type: 'leaderboard_reward',
          title: 'Monthly Leaderboard Reward',
          reward: '0.8 SOL',
          rank: 15,
          timestamp: '2025-03-31T23:59:59Z'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quest_completed':
        return '';
      case 'nft_purchase':
        return '';
      case 'daily_checkin':
        return '';
      case 'quest_subtask':
        return '';
      case 'leaderboard_reward':
        return '';
      default:
        return '';
    }
  };

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
        <div className="bg-dark-card rounded-xl p-8 max-w-md mx-auto">
          <p className="text-gray-300 mb-6">Connect your wallet to view your profile</p>
          <button className="bg-solana-purple hover:bg-solana-purple-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-green mx-auto"></div>
        <p className="text-gray-300 mt-4">Loading profile...</p>
      </div>
    );
  }

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>No profile data.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-dark-card rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-solana-purple rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {connected && publicKey ? formatWalletAddress(publicKey.toString()).charAt(0).toUpperCase() : '?'}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{publicKey ? formatWalletAddress(publicKey.toString()) : 'Unknown User'}</h1>
            <p className="text-gray-400">Level {userStats?.level} Explorer • Joined {userStats ? formatDate(userStats.joinedDate) : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-white border-b-2 border-solana-green' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'nfts' ? 'text-white border-b-2 border-solana-green' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('nfts')}
        >
          NFTs
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'referrals' ? 'text-white border-b-2 border-solana-green' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('referrals')}
        >
          Referrals
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'activity' ? 'text-white border-b-2 border-solana-green' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'points' ? 'text-white border-b-2 border-solana-green' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('points')}
        >
          Points
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total XP</span>
                <span className="text-white font-medium">{userStats.totalXP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Level</span>
                <span className="text-white font-medium">{userStats.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quests Completed</span>
                <span className="text-white font-medium">{userStats.questsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Points</span>
                <span className="text-white font-medium">{userStats.totalPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Rank</span>
                <span className="text-white font-medium">#{userStats.rank}</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">NFT Boosts</h2>
            {userNFTs.length > 0 ? (
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src={userNFTs[0].image}
                    alt={userNFTs[0].name}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-white">{userNFTs[0].name}</h3>
                    <p className="text-sm text-gray-400">{userNFTs[0].rarity}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {userNFTs[0].boosts.map((boost, index) => (
                    <div key={index} className="flex items-center bg-gray-800 rounded-lg p-2">
                      <div className="w-8 h-8 bg-solana-purple/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-solana-purple font-bold">{boost.value}</span>
                      </div>
                      <span className="text-gray-300">{boost.type} Boost</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">You don't have any NFTs yet</p>
                <Link
                  to="/nft/purchase"
                  className="bg-solana-purple hover:bg-solana-purple-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Get SolQuest NFT
                </Link>
              </div>
            )}
          </div>

          <div className="bg-dark-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-sm text-solana-green hover:text-solana-green-light"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {activityHistory.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span role="img" aria-label={activity.type}>
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <div className="flex text-sm">
                      <span className="text-gray-400 mr-3">{formatTime(activity.timestamp)}</span>
                      {activity.points && (
                        <span className="text-solana-purple">+{activity.points} pts</span>
                      )}
                      {activity.xp && (
                        <span className="text-solana-green ml-2">+{activity.xp} XP</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nfts' && (
        <div className="bg-dark-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Your NFTs</h2>

          {userNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNFTs.map((nft) => (
                <div key={nft.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{nft.name}</h3>
                      <span className="bg-solana-purple/20 text-solana-purple text-xs font-medium px-2 py-1 rounded">
                        {nft.rarity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{nft.description}</p>
                    <div className="space-y-2">
                      {nft.boosts.map((boost, index) => (
                        <div key={index} className="flex items-center bg-gray-700 rounded-lg p-2">
                          <div className="w-8 h-8 bg-solana-purple/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-solana-purple font-bold">{boost.value}</span>
                          </div>
                          <span className="text-gray-300">{boost.type} Boost</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-sm text-gray-400">
                        Acquired on {formatDate(nft.acquiredDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-6 h-full">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">➕</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Get More NFTs</h3>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Enhance your SolQuest experience with exclusive NFTs
                </p>
                <Link
                  to="/nft/purchase"
                  className="bg-solana-purple hover:bg-solana-purple-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Browse NFTs
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🖼️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No NFTs Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Enhance your SolQuest experience with exclusive NFTs that provide boosts and benefits
              </p>
              <Link
                to="/nft/purchase"
                className="bg-solana-purple hover:bg-solana-purple-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Get Your First NFT
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'referrals' && (
        <ReferralSystem />
      )}

      {activeTab === 'activity' && (
        <div className="bg-dark-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Activity History</h2>

          <div className="space-y-4">
            {activityHistory.map((activity) => (
              <div key={activity.id} className="flex p-4 bg-gray-800 rounded-lg">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span role="img" aria-label={activity.type} className="text-xl">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-400">{formatDate(activity.timestamp)} at {new Date(activity.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                      {activity.points && (
                        <span className="bg-solana-purple/20 text-solana-purple text-xs font-medium px-2 py-1 rounded">
                          +{activity.points} pts
                        </span>
                      )}
                      {activity.xp && (
                        <span className="bg-solana-green/20 text-solana-green text-xs font-medium px-2 py-1 rounded">
                          +{activity.xp} XP
                        </span>
                      )}
                      {activity.reward && (
                        <span className="bg-yellow-500/20 text-yellow-500 text-xs font-medium px-2 py-1 rounded">
                          {activity.reward}
                        </span>
                      )}
                      {activity.streak && (
                        <span className="bg-orange-500/20 text-orange-500 text-xs font-medium px-2 py-1 rounded">
                          {activity.streak} day streak
                        </span>
                      )}
                    </div>
                  </div>

                  {activity.type === 'leaderboard_reward' && (
                    <div className="mt-2 p-2 bg-gray-700 rounded">
                      <p className="text-sm text-gray-300">
                        Congratulations! You ranked #{activity.rank} in the monthly leaderboard and earned {activity.reward}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'points' && (
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Points</h2>
          <div className="mb-4">
            <div className="text-lg font-semibold">Wallet: <span className="text-gray-400">{profile.walletAddress}</span></div>
            <div className="text-lg font-semibold">Total Points: <span className="text-solana-green">{profile.points}</span></div>
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2">Points History</h3>
          {profile.pointsHistory && profile.pointsHistory.length > 0 ? (
            <table className="w-full text-left border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Points</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {profile.pointsHistory.slice().reverse().map((entry, idx) => (
                  <tr key={idx} className="border-t border-gray-700">
                    <td className="px-3 py-2">{entry.description}</td>
                    <td className="px-3 py-2 text-solana-green">+{entry.points}</td>
                    <td className="px-3 py-2 text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-400">No points history yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
