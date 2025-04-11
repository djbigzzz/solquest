import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useReferrals from '../hooks/useReferrals';
import { toast } from 'react-hot-toast';

const ReferralDashboard = () => {
  const { connected } = useWallet();
  const { referralCode, referralCount, referralLink, isLoading, copyReferralLink } = useReferrals();
  const [rewardsPending, setRewardsPending] = useState(0);
  const [rewardsClaimed, setRewardsClaimed] = useState(0);

  useEffect(() => {
    if (connected && !isLoading) {
      // Calculate pending rewards based on referral count
      // For this example, each referral is worth 0.05 SOL
      const pendingAmount = referralCount * 0.05;
      setRewardsPending(pendingAmount);
      
      // In a real app, you would fetch claimed rewards from your backend
      setRewardsClaimed(0.15); // Mock data
    } else {
      setRewardsPending(0);
      setRewardsClaimed(0);
    }
  }, [connected, referralCount, isLoading]);

  const handleClaimRewards = () => {
    if (rewardsPending > 0) {
      // In a real app, this would trigger a blockchain transaction
      toast.success(`Claimed ${rewardsPending} SOL in rewards!`);
      
      // Update state to reflect claimed rewards
      setRewardsClaimed(prev => prev + rewardsPending);
      setRewardsPending(0);
    } else {
      toast.error('No rewards available to claim');
    }
  };

  if (!connected) {
    return (
      <div className="bg-dark-card rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Referral Program</h2>
        <p className="text-gray-300 mb-4">Connect your wallet to access the referral program and start earning rewards!</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-solana-purple to-solana-green p-4">
        <h2 className="text-xl font-bold text-white">Your Referral Dashboard</h2>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-solana-green"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Your Referrals</p>
                <p className="text-2xl font-bold text-white">{referralCount}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Pending Rewards</p>
                <p className="text-2xl font-bold text-solana-green">{rewardsPending.toFixed(2)} SOL</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Claimed Rewards</p>
                <p className="text-2xl font-bold text-solana-purple">{rewardsClaimed.toFixed(2)} SOL</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-white font-semibold mb-2">Your Referral Code</p>
              <div className="flex items-center">
                <div className="bg-gray-800 px-4 py-2 rounded-l-lg border border-gray-700 flex-1">
                  <span className="text-gray-300 font-mono">{referralCode}</span>
                </div>
                <button 
                  className="bg-solana-purple hover:bg-solana-purple/80 text-white px-4 py-2 rounded-r-lg"
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    toast.success('Referral code copied!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-white font-semibold mb-2">Your Referral Link</p>
              <div className="flex items-center">
                <div className="bg-gray-800 px-4 py-2 rounded-l-lg border border-gray-700 flex-1 overflow-hidden">
                  <span className="text-gray-300 font-mono truncate block">{referralLink}</span>
                </div>
                <button 
                  className="bg-solana-purple hover:bg-solana-purple/80 text-white px-4 py-2 rounded-r-lg"
                  onClick={copyReferralLink}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleClaimRewards}
                disabled={rewardsPending <= 0}
                className={`px-6 py-3 rounded-lg font-bold ${
                  rewardsPending > 0
                    ? 'bg-gradient-to-r from-solana-purple to-solana-green hover:from-solana-green hover:to-solana-purple text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                } transition-all`}
              >
                {rewardsPending > 0 ? `Claim ${rewardsPending.toFixed(2)} SOL` : 'No Rewards to Claim'}
              </button>
            </div>
            
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">How it Works</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Share your referral link with friends</li>
                <li>Earn 0.05 SOL for each friend who completes a quest</li>
                <li>Claim your rewards directly to your wallet</li>
                <li>Your friends also get a 10% bonus on their quest rewards!</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;
