import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const NFTPurchase = () => {
  const { connected } = useWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  
  const handlePurchase = () => {
    if (!connected) return;
    
    setIsPurchasing(true);
    
    // Simulate purchase process
    setTimeout(() => {
      setIsPurchasing(false);
      setPurchaseComplete(true);
      
      // Celebration animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // In a real app, we would interact with the Solana blockchain here
    }, 2000);
  };
  
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Purchase NFT</h1>
        <div className="bg-dark-card rounded-xl p-8 max-w-md mx-auto">
          <p className="text-gray-300 mb-6">Connect your wallet to purchase NFTs</p>
          <button className="bg-solana-purple hover:bg-solana-purple-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  if (purchaseComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-dark-card rounded-xl p-8 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-solana-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Complete!</h1>
          <p className="text-gray-300 mb-8">
            Congratulations! You now own the SolQuest Explorer NFT. Your account has been updated with all the benefits.
          </p>
          
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-solana-green font-bold text-xl">+30%</div>
                <div className="text-gray-400 text-sm">XP Boost</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-solana-green font-bold text-xl">+20%</div>
                <div className="text-gray-400 text-sm">SOL Rewards</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-solana-green font-bold text-xl">VIP</div>
                <div className="text-gray-400 text-sm">Access</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/profile"
              className="bg-solana-purple hover:bg-solana-purple-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              View in Profile
            </Link>
            <Link
              to="/"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Purchase NFT</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-dark-card rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="mb-2 inline-block bg-solana-green text-xs font-bold text-black px-2 py-1 rounded">
              LIMITED EDITION
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">SolQuest Explorer NFT</h2>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-solana-purple/20 rounded-xl blur-xl"></div>
              <img 
                src="https://via.placeholder.com/400x400/9945FF/FFFFFF?text=SolQuest+Explorer+NFT" 
                alt="SolQuest Explorer NFT" 
                className="relative z-10 w-full h-auto object-cover rounded-xl"
              />
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Collection</span>
                <span className="text-white font-medium">SolQuest Explorers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rarity</span>
                <span className="text-white font-medium">Rare</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Supply</span>
                <span className="text-white font-medium">1000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minted</span>
                <span className="text-white font-medium">423 / 1000</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-card rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">NFT Benefits</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-solana-purple/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">XP Boost</h3>
                <p className="text-gray-400">
                  Earn 30% more XP from all quests and activities, helping you level up faster and unlock rewards.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-solana-purple/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">SOL Rewards Boost</h3>
                <p className="text-gray-400">
                  Get 20% more SOL rewards from completed quests, increasing your earnings on the platform.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-solana-purple/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">🔑</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">VIP Access</h3>
                <p className="text-gray-400">
                  Gain access to exclusive quests and events only available to NFT holders.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-solana-purple/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Leaderboard Multiplier</h3>
                <p className="text-gray-400">
                  Earn points faster for the monthly leaderboard competition, increasing your chances of winning SOL rewards.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-gray-400 text-sm">Price</span>
                <div className="text-2xl font-bold text-white">1.5 SOL</div>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm">Your Balance</span>
                <div className="text-xl font-medium text-white">12.8 SOL</div>
              </div>
            </div>
            
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className={`w-full py-3 px-6 rounded-lg font-bold text-center ${
                isPurchasing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-solana-green hover:bg-solana-green-light text-black'
              } transition-colors`}
            >
              {isPurchasing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Mint NFT for 1.5 SOL'
              )}
            </button>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Gas fees will be calculated at the time of transaction
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-dark-card rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">How do I use my NFT?</h3>
            <p className="text-gray-400">
              Your NFT benefits are automatically applied to your account once purchased. You'll immediately start earning boosted XP and rewards.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Can I transfer my NFT?</h3>
            <p className="text-gray-400">
              Yes, SolQuest Explorer NFTs are standard Solana NFTs that can be transferred to other wallets or sold on secondary marketplaces.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Will there be more NFTs in the future?</h3>
            <p className="text-gray-400">
              Yes, we plan to release additional NFT collections with different benefits and utilities. Explorer NFT holders will get early access.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">What happens if the NFTs sell out?</h3>
            <p className="text-gray-400">
              Once all 1000 Explorer NFTs are minted, they will only be available on secondary marketplaces like Magic Eden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTPurchase;
