import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import CustomWalletButton from './CustomWalletButton';

function Navbar() {
  const { connected, publicKey } = useWallet();
  const [walletConnected, setWalletConnected] = useState(false);
  
  // Check if wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [connected, publicKey]);
  
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
          <Link to="/" className="text-white hover:text-purple-400 transition-colors">Home</Link>
          {walletConnected && (
            <Link to="/profile" className="text-white hover:text-purple-400 transition-colors flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </Link>
          )}
        </div>
        
        <CustomWalletButton />
      </div>
    </nav>
  );
}

export default Navbar;
