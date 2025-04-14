import React, { useEffect } from 'react';
import SocialConnections from '../components/SocialConnections';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast, Toaster } from 'react-hot-toast';

const SocialConnectionsPage = () => {
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check for Twitter OAuth callback
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (code && state) {
      // This would be a Twitter OAuth callback
      const storedState = localStorage.getItem('twitter_oauth_state');
      
      if (state === storedState) {
        // Valid OAuth callback, process the connection
        toast.success('Twitter account connected successfully!');
        
        // In a real implementation, you would send this code to your backend
        // For demo purposes, we'll simulate a successful connection
        const walletAddress = localStorage.getItem('wallet_address');
        if (walletAddress) {
          const username = '@' + walletAddress.substring(0, 8);
          localStorage.setItem('twitter_connected', 'true');
          localStorage.setItem('twitter_username', username);
        }
        
        // Clean URL to remove OAuth parameters
        window.history.replaceState({}, document.title, '/social-connections');
      } else {
        toast.error('Invalid OAuth state. Please try connecting again.');
      }
    }
  }, []);

  // Redirect to home if not connected or authenticated
  useEffect(() => {
    if (!connected || !isAuthenticated) {
      navigate('/');
    }
  }, [connected, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-center" />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Connect Your Accounts</h1>
        <div className="flex items-center space-x-2">
          <Link 
            to="/profile"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
      
      <SocialConnections />
      
      <div className="mt-10 text-center">
        <Link 
          to="/quests"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block"
        >
          Return to Quests
        </Link>
      </div>
    </div>
  );
};

export default SocialConnectionsPage;
