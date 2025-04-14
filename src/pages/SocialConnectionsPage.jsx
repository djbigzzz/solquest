import React from 'react';
import SocialConnections from '../components/SocialConnections';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const SocialConnectionsPage = () => {
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not connected or authenticated
  React.useEffect(() => {
    if (!connected || !isAuthenticated) {
      navigate('/');
    }
  }, [connected, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Connect Your Accounts</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Back to Profile
          </button>
        </div>
      </div>
      
      <SocialConnections />
    </div>
  );
};

export default SocialConnectionsPage;
