import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useAuth from '../hooks/useAuth';
import TwitterFollowQuest from '../components/TwitterFollowQuest';
import NFTMintQuest from '../components/NFTMintQuest';

function QuestsPage() {
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Quests</h1>
      </div>
      
      {!connected || !isAuthenticated ? (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-yellow-200 text-lg mb-2">Please connect your wallet to access quests</p>
          <p className="text-yellow-200/70 text-sm">You need to connect your Solana wallet to start completing quests</p>
        </div>
      ) : null}
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Available Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TwitterFollowQuest />
          <NFTMintQuest />
        </div>
      </div>
    </div>
  );
}

export default QuestsPage;
