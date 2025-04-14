import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useAuth from '../hooks/useAuth';
import ProjectCard from '../components/ProjectCard';

function Dashboard() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  
  // Check if wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [connected, publicKey]);
  
  // Listen for wallet connection events
  useEffect(() => {
    const handleWalletConnected = () => {
      setWalletConnected(true);
    };
    
    const handleWalletDisconnected = () => {
      setWalletConnected(false);
    };
    
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);
    
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []);

  // SolQuest project data
  const solQuestProject = {
    name: 'SolQuest',
    slug: 'solquest',
    description: 'Complete quests for SolQuest to earn points and exclusive rewards. Follow SolQuest on Twitter and mint the OG NFT to show your support.',
    questCount: 2,
    totalPoints: 500,
    image: '/images/solquest-logo.png'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Available Projects</h1>
      
      <div className="max-w-xl mx-auto">
        <ProjectCard project={solQuestProject} />
      </div>
    </div>
  );
}

export default Dashboard;
