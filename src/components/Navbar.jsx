import React from 'react';
import { Link } from 'react-router-dom';
import CustomWalletButton from './CustomWalletButton';

function Navbar() {
  return (
    <nav className="bg-dark-bg border-b border-gray-800 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-white">
            <span className="text-solana-purple">Sol</span>
            <span className="text-solana-green">Quest</span>
            <span className="text-white">.io</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/quests" className="nav-link">Quests</Link>
          <Link to="/rewards" className="nav-link">Rewards</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
        
        <CustomWalletButton />
      </div>
    </nav>
  );
}

export default Navbar;
