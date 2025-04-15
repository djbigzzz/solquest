import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function QuestsPage() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useAuth();
  const [activeQuest, setActiveQuest] = useState('social'); // 'social' or 'nft'
  
  // Quest progress states
  const [socialStarted, setSocialStarted] = useState(false);
  const [socialCompleted, setSocialCompleted] = useState(false);
  const [nftStarted, setNftStarted] = useState(false);
  const [nftCompleted, setNftCompleted] = useState(false);
  
  // Quest handlers
  const handleStartSocial = () => {
    window.open('https://x.com/SolQuestio', '_blank');
    setSocialStarted(true);
  };
  
  const handleVerifySocial = () => {
    setSocialCompleted(true);
    // In a real implementation, call API to verify
  };
  
  const handleStartNFT = () => {
    // Open NFT mint page
    window.open('https://solquest.io/mint', '_blank');
    setNftStarted(true);
  };
  
  const handleVerifyNFT = () => {
    setNftCompleted(true);
    // In a real implementation, call API to verify
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">SolQuest Quests</h1>
          <p className="text-gray-400">Complete quests to earn points and exclusive rewards</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="bg-purple-900/30 px-3 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <span className="text-purple-300 text-sm">Basic Quest</span>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-3 py-1 rounded-full">
            <span className="text-blue-300 text-sm">Limited Time</span>
          </div>
        </div>
      </div>
      
      {!connected || !isAuthenticated ? (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-5 mb-6 text-center max-w-md mx-auto">
          <p className="text-yellow-200">Please connect your wallet to access quests</p>
          <button 
            onClick={() => window.dispatchEvent(new Event('openWalletModal'))}
            className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-6 shadow-xl border border-gray-800">
          {/* Quest Overview */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">Quest Overview</span>
                <div className="flex items-center">
                  <span className="text-gray-400 text-xs">0%</span>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full ml-2">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                      style={{ width: `${(socialCompleted && nftCompleted) ? 100 : (socialCompleted || nftCompleted) ? 50 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">SolQuest Rewards Program</h2>
              <p className="text-gray-400">Complete tasks to earn points and exclusive NFT rewards.</p>
            </div>
            
            <div className="mt-4 md:mt-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-800/30">
              <div className="flex items-center">
                <div className="bg-purple-900/50 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Rewards</h3>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold">150</span>
                    <span className="text-gray-400 text-sm ml-1">points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quest Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Step 01 - X Follow */}
            <div className={`bg-gradient-to-br ${socialCompleted ? 'from-green-900/30 to-green-800/30 border-green-700/30' : 'from-purple-900/30 to-blue-900/30 border-purple-700/30'} rounded-lg p-5 border relative`}>
              <div className="absolute top-3 right-3">
                {socialCompleted ? (
                  <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">Completed</div>
                ) : (
                  <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">Active</div>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-3">01</div>
              <h3 className="text-lg font-semibold text-white mb-1">Follow on X</h3>
              <p className="text-gray-400 text-sm mb-4">Follow SolQuest on X to stay updated with the latest announcements</p>
              
              <div className="space-y-2">
                {!socialStarted ? (
                  <button 
                    onClick={handleStartSocial}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Start
                  </button>
                ) : !socialCompleted ? (
                  <button 
                    onClick={handleVerifySocial}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Verify
                  </button>
                ) : (
                  <div className="flex items-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step 02 - NFT Mint */}
            <div className={`bg-gradient-to-br ${nftCompleted ? 'from-green-900/30 to-green-800/30 border-green-700/30' : 'from-purple-900/30 to-blue-900/30 border-purple-700/30'} rounded-lg p-5 border relative`}>
              <div className="absolute top-3 right-3">
                {nftCompleted ? (
                  <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">Completed</div>
                ) : socialCompleted ? (
                  <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">Active</div>
                ) : (
                  <div className="bg-gray-700/20 text-gray-500 text-xs px-2 py-1 rounded-full">Locked</div>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-3">02</div>
              <h3 className="text-lg font-semibold text-white mb-1">Mint OG NFT</h3>
              <p className="text-gray-400 text-sm mb-4">Mint the exclusive SolQuest OG NFT to unlock special rewards</p>
              
              <div className="space-y-2">
                {!nftStarted ? (
                  <button 
                    onClick={handleStartNFT}
                    disabled={!socialCompleted}
                    className={`w-full ${socialCompleted ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gray-700'} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Mint NFT
                  </button>
                ) : !nftCompleted ? (
                  <button 
                    onClick={handleVerifyNFT}
                    className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Verify
                  </button>
                ) : (
                  <div className="flex items-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step 03 - Activity (Locked) */}
            <div className="bg-gray-900/30 rounded-lg p-5 border border-gray-800/50 relative opacity-70">
              <div className="absolute top-3 right-3">
                <div className="bg-gray-700/20 text-gray-500 text-xs px-2 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Locked
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-700 mb-3">03</div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">Activity</h3>
              <p className="text-gray-500 text-sm mb-4">Complete on-chain activity to earn additional rewards</p>
              
              <button 
                disabled
                className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed opacity-50"
              >
                Locked
              </button>
            </div>
            
            {/* Step 04 - Claim (Locked) */}
            <div className="bg-gray-900/30 rounded-lg p-5 border border-gray-800/50 relative opacity-70">
              <div className="absolute top-3 right-3">
                <div className="bg-gray-700/20 text-gray-500 text-xs px-2 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Locked
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-700 mb-3">04</div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">Claim</h3>
              <p className="text-gray-500 text-sm mb-4">Claim your rewards after completing all tasks</p>
              
              <button 
                disabled
                className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed opacity-50"
              >
                Locked
              </button>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-purple-900/30 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Need Help?</h3>
                <p className="text-gray-400 text-sm">Join our Discord community for support</p>
              </div>
            </div>
            
            <a 
              href="https://discord.gg/solquest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              Join Discord
            </a>
          </div>
        </div>
      )}
      
      {/* Coming Soon Section */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold text-white mb-4">More Quests Coming Soon</h2>
        <p className="text-gray-400 mb-6">Stay tuned for additional quests and opportunities to earn rewards!</p>
      </div>
    </div>
  );
}

export default QuestsPage;
