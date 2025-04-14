import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import TwitterFollowQuest from '../components/TwitterFollowQuest';
import NFTMintQuest from '../components/NFTMintQuest';
import useAuth from '../hooks/useAuth';

function QuestsPage() {
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">SolQuest Quests</h1>
      <p className="text-gray-400 mb-6">Complete quests for SolQuest to earn points and exclusive rewards.</p>

      {!connected || !isAuthenticated ? (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-3 mb-6 text-center max-w-md mx-auto">
          <p className="text-yellow-200 text-sm">Please connect your wallet to access quests</p>
        </div>
      ) : null}
      
      {/* Main Quest Section */}
      <div className="max-w-sm mx-auto space-y-6">
        <div className="w-full">
          <TwitterFollowQuest />
        </div>
        <div className="w-full">
          <NFTMintQuest />
        </div>
      </div>
      
      {/* Coming Soon Section */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold text-white mb-4">More Quests Coming Soon</h2>
        <p className="text-gray-400 mb-6">Stay tuned for additional quests and opportunities to earn rewards!</p>
      </div>
    </div>
  );
}

export default QuestsPage;
