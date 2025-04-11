import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import useSolanaWallet from '../hooks/useWallet';
import images from '../assets/images/placeholder';

const ReferralSystem = () => {
  const { connected, publicKey } = useWallet();
  const { formatWalletAddress } = useSolanaWallet();
  const [referralCode, setReferralCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [referralLevel, setReferralLevel] = useState(1);
  const [referralProgress, setReferralProgress] = useState(40); // percentage to next level
  const [totalEarnings, setTotalEarnings] = useState(0.12);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [referredUsers, setReferredUsers] = useState([
    { address: 'abc123...xyz1', joinedDate: '2025-03-15', pointsGenerated: 250, avatar: images.userAvatar, status: 'active' },
    { address: 'def456...xyz2', joinedDate: '2025-03-28', pointsGenerated: 120, avatar: images.userAvatar, status: 'active' },
  ]);
  
  // Calculate total earnings and referral progress
  useEffect(() => {
    if (referredUsers.length > 0) {
      const totalPoints = referredUsers.reduce((sum, user) => sum + user.pointsGenerated, 0);
      const calculatedEarnings = totalPoints * 0.0005; // Example calculation
      setTotalEarnings(calculatedEarnings.toFixed(2));
      
      // Calculate progress to next level
      const nextLevelThreshold = referralLevel * 500;
      const progress = Math.min(Math.floor((totalPoints / nextLevelThreshold) * 100), 100);
      setReferralProgress(progress);
      
      // Check if we should level up
      if (progress === 100) {
        setReferralLevel(prevLevel => prevLevel + 1);
        setReferralProgress(0);
        toast.success('Congratulations! Your referral level increased!');
      }
    }
  }, [referredUsers, referralLevel]);

  // Generate a referral code based on user's wallet address
  const generateReferralCode = () => {
    if (!connected || !publicKey) return 'CONNECT-WALLET';
    
    const addressStr = publicKey.toString();
    return `SQ-${addressStr.substring(0, 4)}${addressStr.substring(addressStr.length - 4)}`;
  };

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    const code = generateReferralCode();
    const referralLink = `https://solquest.io/join?ref=${code}`;
    
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setIsCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy referral link');
      });
  };
  
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  const shareVia = (platform) => {
    const code = generateReferralCode();
    const referralLink = `https://solquest.io/join?ref=${code}`;
    const message = `Join me on SolQuest and earn rewards! Use my referral code: ${code}`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
        break;
      case 'discord':
        navigator.clipboard.writeText(`${message} ${referralLink}`);
        toast.success('Copied to clipboard! Now you can paste it in Discord.');
        return;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  
  const getReferralPerks = () => {
    const perks = [
      { level: 1, xpBoost: '1%', solBoost: '10%' },
      { level: 2, xpBoost: '2%', solBoost: '15%' },
      { level: 3, xpBoost: '3%', solBoost: '20%' },
      { level: 4, xpBoost: '5%', solBoost: '25%' },
      { level: 5, xpBoost: '7%', solBoost: '30%' }
    ];
    
    return perks.find(perk => perk.level === referralLevel) || perks[0];
  };

  return (
    <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Referral Program</h2>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
            <span className="mr-1">Level {referralLevel}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Invite friends to SolQuest and earn rewards when they complete quests!
          </p>
          
          {/* Progress to next level */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress to Level {referralLevel + 1}</span>
              <span>{referralProgress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-solana-purple to-solana-green" 
                style={{ width: `${referralProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-solana-green font-bold text-lg">+{getReferralPerks().xpBoost}</div>
                <div className="text-gray-400 text-sm">XP Boost from Referrals</div>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-solana-green/10 to-transparent"></div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-solana-green font-bold text-lg">+{getReferralPerks().solBoost}</div>
                <div className="text-gray-400 text-sm">SOL Rewards from Leaderboard</div>
              </div>
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-solana-green/10 to-transparent"></div>
            </div>
          </div>
          
          {connected ? (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Your Referral Code:</div>
              <div className="flex items-center">
                <div className="bg-gray-900 rounded-l px-4 py-2 flex-1 font-mono text-white border-r border-gray-700">
                  {generateReferralCode()}
                </div>
                <button 
                  onClick={copyReferralLink}
                  className="bg-solana-purple hover:bg-solana-purple-light text-white px-4 py-2 rounded-r transition-colors flex items-center"
                >
                  {isCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-3">
                <button 
                  onClick={toggleShareOptions}
                  className="text-sm text-solana-green hover:text-solana-green-light flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {showShareOptions ? 'Hide share options' : 'Share with friends'}
                </button>
                
                {showShareOptions && (
                  <div className="mt-2 flex space-x-2">
                    <button 
                      onClick={() => shareVia('twitter')}
                      className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors"
                      title="Share on Twitter"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => shareVia('telegram')}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                      title="Share on Telegram"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => shareVia('discord')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors"
                      title="Copy for Discord"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4 mb-4 text-center">
              <p className="text-gray-400 mb-2">Connect your wallet to get your referral code</p>
            </div>
          )}
        </div>
        
        {connected && referredUsers.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Your Referrals</h3>
              <div className="text-sm text-solana-green font-medium">
                {referredUsers.length} friends referred
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="p-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Points Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {referredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="p-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                            <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
                          </div>
                          <span className="text-white">{user.address}</span>
                          {user.status === 'active' && (
                            <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-400">{user.joinedDate}</td>
                      <td className="p-3 text-sm text-right">
                        <div className="inline-flex items-center bg-solana-green/10 text-solana-green font-medium px-2 py-1 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {user.pointsGenerated}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-sm">Total earnings from referrals</div>
                  <div className="text-solana-green font-bold text-xl">{totalEarnings} SOL</div>
                </div>
                <div className="bg-solana-purple/20 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-solana-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Earn more by sharing your referral code with friends!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSystem;
