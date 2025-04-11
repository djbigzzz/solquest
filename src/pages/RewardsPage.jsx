import React from 'react';

function RewardsPage() {
  // Sample rewards data
  const userXP = 850;
  const userLevel = Math.floor(userXP / 200) + 1;
  const nextLevelXP = userLevel * 200;
  const progressToNextLevel = (userXP % 200) / 200 * 100;
  
  const rewards = [
    {
      id: 'reward-1',
      title: 'Solana Starter Pack',
      description: 'A collection of Solana NFTs for beginners',
      xpRequired: 500,
      claimed: true,
      image: 'https://images.unsplash.com/photo-1647163927506-399a13f9f207?q=80&w=2832&auto=format&fit=crop'
    },
    {
      id: 'reward-2',
      title: 'Solana Hoodie',
      description: 'Limited edition Solana branded hoodie',
      xpRequired: 1000,
      claimed: false,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2787&auto=format&fit=crop'
    },
    {
      id: 'reward-3',
      title: 'Exclusive NFT Drop',
      description: 'Access to an exclusive NFT collection',
      xpRequired: 1500,
      claimed: false,
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop'
    },
    {
      id: 'reward-4',
      title: 'Solana Conference Ticket',
      description: 'Free ticket to the next Solana conference',
      xpRequired: 2000,
      claimed: false,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Rewards</h1>
      
      {/* User XP Progress */}
      <div className="bg-card-bg rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <div className="text-solana-purple font-bold">{userXP} XP</div>
        </div>
        
        <div className="w-full bg-dark-bg rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-solana-purple to-solana-green h-4 rounded-full" 
            style={{ width: `${progressToNextLevel}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-white/70">
          <div>Level {userLevel}</div>
          <div>{userXP}/{nextLevelXP} XP to Level {userLevel + 1}</div>
        </div>
      </div>
      
      {/* Available Rewards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map(reward => (
            <div key={reward.id} className="bg-card-bg rounded-xl overflow-hidden">
              <div className="h-48">
                <img 
                  src={reward.image} 
                  alt={reward.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{reward.title}</h3>
                <p className="text-white/70 text-sm mb-3">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-white/70">Required: {reward.xpRequired} XP</div>
                  {reward.claimed ? (
                    <div className="bg-gray-700 text-white/70 py-1.5 px-4 rounded-lg text-sm">Claimed</div>
                  ) : userXP >= reward.xpRequired ? (
                    <button className="bg-solana-green text-black font-semibold py-1.5 px-4 rounded-lg text-sm">
                      Claim Reward
                    </button>
                  ) : (
                    <button className="bg-gray-700 text-white/70 py-1.5 px-4 rounded-lg text-sm" disabled>
                      Locked
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;
