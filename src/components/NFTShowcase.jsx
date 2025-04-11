import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

const NFTShowcase = () => {
  const { connected } = useWallet();

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl overflow-hidden shadow-xl mb-8">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:w-1/2">
          <div className="mb-2 inline-block bg-solana-green text-xs font-bold text-black px-2 py-1 rounded">
            LIMITED EDITION
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">SolQuest Explorer NFT</h2>
          <p className="text-gray-300 mb-6">
            Unlock exclusive benefits and boost your rewards with the SolQuest Explorer NFT. 
            Holders receive +30% XP and +20% SOL rewards on all quests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-solana-green font-bold text-lg">+30%</div>
              <div className="text-gray-400 text-sm">XP Boost</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-solana-green font-bold text-lg">+20%</div>
              <div className="text-gray-400 text-sm">SOL Rewards</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-solana-green font-bold text-lg">VIP</div>
              <div className="text-gray-400 text-sm">Access</div>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="text-white mr-4">
              <span className="text-2xl font-bold">1.5 SOL</span>
            </div>
            <Link 
              to={connected ? "/nft/purchase" : "/connect"}
              className="bg-solana-green hover:bg-solana-green-light text-black font-bold py-2 px-6 rounded-full transition-colors"
            >
              {connected ? "Mint Now" : "Connect Wallet to Mint"}
            </Link>
          </div>
          
          <div className="text-gray-400 text-sm">
            Only 1000 NFTs available • 423 minted
          </div>
        </div>
        
        <div className="md:w-1/2 flex items-center justify-center p-6">
          <div className="relative">
            <div className="absolute inset-0 bg-solana-purple/20 rounded-full blur-xl"></div>
            <img 
              src="/nft-explorer.png" 
              alt="SolQuest Explorer NFT" 
              className="relative z-10 w-64 h-64 object-cover rounded-xl transform hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/256x256/9945FF/FFFFFF?text=SolQuest+NFT";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTShowcase;
