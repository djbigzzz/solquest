import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  return (
    <div className="hidden md:block w-64 bg-card-bg p-6 border-r border-gray-800">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <nav className="space-y-2">
          <Link 
            to="/" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Home</span>
          </Link>
          
          <Link 
            to="/quests" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/quests' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <span>Quests</span>
          </Link>
          
          <Link 
            to="/leaderboard" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/leaderboard' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>Leaderboard</span>
          </Link>
          
          <Link 
            to="/rewards" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/rewards' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Rewards</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/profile' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>Profile</span>
          </Link>
          
          <Link 
            to="/nft/purchase" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/nft/purchase' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Explorer NFT</span>
          </Link>
          
          <Link 
            to="/referrals" 
            className={`flex items-center p-2 rounded-lg ${location.pathname === '/referrals' ? 'bg-solana-purple/20 text-white' : 'text-white/80 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            <span>Referrals</span>
          </Link>
        </nav>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="space-y-2">
          <div className="flex items-center p-2 rounded-lg text-white/80 hover:bg-gray-800 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-solana-purple mr-3"></div>
            <span>On-Chain Quests</span>
          </div>
          <div className="flex items-center p-2 rounded-lg text-white/80 hover:bg-gray-800 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-solana-green mr-3"></div>
            <span>Off-Chain Quests</span>
          </div>
          <div className="flex items-center p-2 rounded-lg text-white/80 hover:bg-gray-800 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
            <span>Solana Projects</span>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="space-y-2">
          <div className="flex items-center p-2 rounded-lg text-white/80 hover:bg-gray-800 cursor-pointer">
            <span>New</span>
          </div>
          <div className="flex items-center p-2 rounded-lg text-white/80 hover:bg-gray-800 cursor-pointer">
            <span>Popular</span>
          </div>
          <div className="flex items-center p-2 rounded-lg text-white/80 hover:bg-gray-800 cursor-pointer">
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
