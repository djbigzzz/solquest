import React from 'react';
import { Link } from 'react-router-dom';
import ReferralDashboard from '../components/ReferralDashboard';

const Referrals = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-400 hover:text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Referral Program</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReferralDashboard />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Top Referrers</h2>
                <div className="space-y-4">
                  {/* Mock leaderboard data */}
                  {[
                    { rank: 1, address: '8xH4...9j2K', count: 47 },
                    { rank: 2, address: '3mN5...7pQr', count: 36 },
                    { rank: 3, address: '5tG7...2xYz', count: 29 },
                    { rank: 4, address: '9aB3...4cDe', count: 23 },
                    { rank: 5, address: '1fGh...8iJk', count: 18 }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                          user.rank === 1 ? 'bg-yellow-500' : 
                          user.rank === 2 ? 'bg-gray-400' : 
                          user.rank === 3 ? 'bg-amber-700' : 'bg-gray-700'
                        }`}>
                          <span className="text-white font-bold">{user.rank}</span>
                        </div>
                        <span className="text-gray-300 font-mono">{user.address}</span>
                      </div>
                      <div className="text-solana-green font-bold">{user.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Referral Rewards</h2>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-solana-purple flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-bold">0.05 SOL per Referral</div>
                        <div className="text-gray-400 text-sm">Base reward</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-solana-green flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-bold">10% Bonus</div>
                        <div className="text-gray-400 text-sm">For your referred friends</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-bold">Exclusive NFTs</div>
                        <div className="text-gray-400 text-sm">At 10, 25, and 50 referrals</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
