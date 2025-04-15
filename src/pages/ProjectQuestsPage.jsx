import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import useAuth from '../hooks/useAuth';
import QuestsPage from './QuestsPage';

const ProjectQuestsPage = () => {
  const { projectSlug } = useParams();
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  
  // Check if wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    // For now, we only have the SolQuest project
    if (projectSlug === 'solquest') {
      setProject({
        name: 'SolQuest',
        description: 'Complete quests for SolQuest to earn points and exclusive rewards.',
        quests: [
          {
            id: 'follow-solquest-twitter',
            title: 'Follow SolQuest on Twitter',
            description: 'Follow SolQuest on Twitter to stay updated with the latest news and announcements.',
            points: 100,
            type: 'twitter'
          },
          {
            id: 'mint-solquest-og-nft',
            title: 'Mint SolQuest OG NFT',
            description: 'Mint the exclusive SolQuest OG NFT. Only 10,000 will ever be minted.',
            points: 400,
            type: 'nft'
          }
        ]
      });
    }
    setLoading(false);
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-300">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{project.name} Quests</h1>
        <p className="text-gray-300 mt-2">{project.description}</p>
      </div>

      {!walletConnected ? (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-yellow-200 text-lg mb-2">Please connect your wallet to access quests</p>
          <p className="text-yellow-200/70 text-sm">You need to connect your Solana wallet to start completing quests</p>
        </div>
      ) : null}

      <div className="space-y-8">
        <QuestsPage />
      </div>
    </div>
  );
};

export default ProjectQuestsPage;
