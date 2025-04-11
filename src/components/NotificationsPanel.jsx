import React from 'react';

function NotificationsPanel() {
  const notifications = [
    { id: 1, message: 'You completed "Solana Basics" quest', time: '2 mins ago' },
    { id: 2, message: 'New quest available: "DeFi Explorer"', time: '1 hour ago' },
    { id: 3, message: 'You earned 50 XP from "NFT Creation"', time: '3 hours ago' },
    { id: 4, message: 'Quest reward claimed: 0.5 SOL', time: '1 day ago' },
    { id: 5, message: 'New badge unlocked: Solana Pioneer', time: '2 days ago' }
  ];

  return (
    <div className="hidden lg:block w-80 bg-card-bg p-6 border-l border-gray-800">
      <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className="p-3 bg-dark-bg rounded-lg">
            <p className="text-sm text-white/90">{notification.message}</p>
            <p className="text-xs text-white/60 mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPanel;
