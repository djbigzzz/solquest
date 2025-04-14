import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const SocialConnections = () => {
  const { publicKey, connected } = useWallet();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [error, setError] = useState('');

  // Twitter OAuth2 configuration
  const TWITTER_CLIENT_ID = 'your-twitter-client-id'; // Replace with your actual Twitter Client ID
  const TWITTER_REDIRECT_URI = `${window.location.origin}/twitter-callback`;
  const TWITTER_SCOPE = 'tweet.read users.read follows.read';

  useEffect(() => {
    // Check if user has connected Twitter account
    const checkTwitterConnection = async () => {
      if (connected && publicKey && isAuthenticated) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/user/social?wallet=${publicKey.toString()}`);
          if (response.data && response.data.twitter) {
            setTwitterConnected(true);
            setTwitterUsername(response.data.twitter.username);
          }
        } catch (error) {
          console.error('Error checking Twitter connection:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkTwitterConnection();
  }, [connected, publicKey, isAuthenticated]);

  // Handle Twitter connection
  const connectTwitter = () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isAuthenticated) {
      setError('Please authenticate first');
      return;
    }

    // Create and store a CSRF token
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('twitter_oauth_state', state);
    localStorage.setItem('wallet_address', publicKey.toString());

    // Redirect to Twitter OAuth authorization page
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI)}&scope=${encodeURIComponent(TWITTER_SCOPE)}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
    
    window.open(authUrl, '_blank');
  };

  // Handle disconnecting Twitter account
  const disconnectTwitter = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/user/disconnect-twitter', { 
        wallet: publicKey.toString() 
      });
      setTwitterConnected(false);
      setTwitterUsername('');
    } catch (error) {
      console.error('Error disconnecting Twitter:', error);
      setError('Failed to disconnect Twitter account');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes - simulate connection/disconnection
  const simulateTwitterConnection = () => {
    setTwitterConnected(true);
    setTwitterUsername('@' + publicKey.toString().substring(0, 8) + '...');
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900/60 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Connect Your Accounts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* On-chain wallet */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-8 h-8 mb-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M21.17 2.06A13.1 13.1 0 0019 1.87a12.94 12.94 0 00-9.61 4.31A12.9 12.9 0 005.07 19a13.07 13.07 0 0010.39 1.81 12.97 12.97 0 007.47-5.93 12.89 12.89 0 001.32-11.07 1 1 0 00-1.26-.66 1 1 0 00-.6.6 10.84 10.84 0 01-1.1 9.31 10.91 10.91 0 01-6.28 5 10.92 10.92 0 01-11-3.37 10.89 10.89 0 01-2.18-11.43 10.86 10.86 0 018.1-7.63 11.22 11.22 0 018.59 1.84 1 1 0 001.16-1.63l.01.02z"></path><path d="M13.5 8.5A1.5 1.5 0 0112 10a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 0112 7a1.5 1.5 0 011.5 1.5z"></path><path d="M12 2a1 1 0 00-1 1v8a1 1 0 002 0V3a1 1 0 00-1-1z"></path>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">On-chain wallet</h3>
              <p className="text-gray-400 text-sm mb-4">Connect your wallet to check your on-chain activity.</p>
            </div>
            <div>
              {connected ? (
                <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center">
                    <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
                    <span className="overflow-hidden text-ellipsis">
                      Connected: {publicKey.toString().substring(0, 4)}...{publicKey.toString().substring(publicKey.toString().length - 4)}
                    </span>
                  </div>
                </div>
              ) : (
                <button className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium">
                  CONNECT
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Twitter */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-8 h-8 mb-3 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">X (Twitter)</h3>
              <p className="text-gray-400 text-sm mb-4">Connect and verify your Twitter account for scoring and social quests.</p>
            </div>
            <div>
              {twitterConnected ? (
                <div className="mb-2">
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-green-500 mr-2">✓ Connected:</span>
                    <span className="text-sm">{twitterUsername}</span>
                  </div>
                  <button 
                    onClick={disconnectTwitter}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center"
                  >
                    <span className="mr-1">○</span> Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={loading ? null : simulateTwitterConnection}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium ${loading ? 'opacity-50' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'CONNECT'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Discord */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-8 h-8 mb-3 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Discord</h3>
              <p className="text-gray-400 text-sm mb-4">Connect and verify your Discord account for scoring and social quests.</p>
            </div>
            <div>
              <button className="w-full bg-gray-700 text-gray-300 rounded-lg py-2 text-sm font-medium cursor-not-allowed">
                SOON
              </button>
            </div>
          </div>
        </div>

        {/* Telegram */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-8 h-8 mb-3 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Telegram</h3>
              <p className="text-gray-400 text-sm mb-4">Connect to check your social profile and communication soon.</p>
            </div>
            <div>
              <button className="w-full bg-gray-700 text-gray-300 rounded-lg py-2 text-sm font-medium cursor-not-allowed">
                SOON
              </button>
            </div>
          </div>
        </div>

        {/* GitHub */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-8 h-8 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Developer activity</h3>
              <p className="text-gray-400 text-sm mb-4">Connect your Github to calculate your developer activity.</p>
            </div>
            <div>
              <button className="w-full bg-gray-700 text-gray-300 rounded-lg py-2 text-sm font-medium cursor-not-allowed">
                SOON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="mt-8 text-center">
        <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-2 rounded-lg flex items-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Log Out
        </button>
      </div>

      {/* Error Message - Only show if there's an error */}
      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SocialConnections;
