import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import QuestValidation from '../components/QuestValidation';
import useSolanaWallet from '../hooks/useWallet';
import images from '../assets/images/placeholder';

const QuestDetails = () => {
  const { questId } = useParams();
  const { connected } = useWallet();
  const { formatWalletAddress } = useSolanaWallet();
  const [quest, setQuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  useEffect(() => {
    fetchQuestDetails();
  }, [questId]);
  
  const fetchQuestDetails = () => {
    setIsLoading(true);
    
    // Mock data - in a real app, this would be fetched from the backend
    setTimeout(() => {
      let mockQuest;
      
      if (questId === 'solana-basics') {
        mockQuest = {
          id: questId,
          title: 'Solana Basics',
          description: 'Complete essential Solana tasks: Follow Solana on X and have at least 0.1 SOL in your wallet',
          fullDescription: `
            <p>Get started with Solana by completing these essential tasks:</p>
            
            <ul>
              <li>Follow the official Solana X/Twitter account to stay updated with the latest news and developments</li>
              <li>Ensure you have at least 0.1 SOL in your wallet to participate in the Solana ecosystem</li>
            </ul>
            
            <p>Complete both tasks to earn SOL rewards and increase your SolQuest level!</p>
          `,
          reward: '0.5 SOL',
          xp: 250,
          progress: 0,
          estimatedTime: '15 minutes',
          difficulty: 'Beginner',
          prerequisites: ['Wallet connection'],
          bannerImage: images.quest,
          category: 'Education',
          partner: 'Phantom',
          partnerLogo: images.phantom,
          createdAt: '2025-03-15T10:00:00Z',
          updatedAt: '2025-04-01T14:30:00Z',
          completions: 2547,
          tasks: [
            {
              id: 'follow-solana',
              title: 'Follow Solana X profile',
              description: 'Follow the official Solana X/Twitter account',
              link: 'https://twitter.com/solana',
              linkText: 'Visit Solana X/Twitter',
              completed: false
            },
            {
              id: 'deposit-sol',
              title: 'Have 0.1 SOL in your wallet',
              description: 'Buy or deposit Solana to your address and have over 0.1 SOL available',
              link: 'https://phantom.app/buy',
              linkText: 'Buy SOL with Phantom',
              completed: false
            }
          ]
        };
      } else if (questId === 'solquest-project') {
        mockQuest = {
          id: questId,
          title: 'SolQuest Project',
          description: 'Join the SolQuest community: Follow on X, join Discord, and mint the SolQuest Explorer NFT',
          fullDescription: `
            <p>Join the SolQuest community and become an official SolQuest Explorer by completing these tasks:</p>
            
            <ul>
              <li>Follow SolQuest on X/Twitter to stay updated with the latest quests and rewards</li>
              <li>Join the SolQuest Discord community to connect with other explorers</li>
              <li>Mint your SolQuest Explorer NFT to unlock exclusive quests and rewards</li>
            </ul>
            
            <p>Complete all tasks to earn SOL rewards and your exclusive SolQuest Explorer NFT!</p>
          `,
          reward: '0.75 SOL + Exclusive NFT',
          xp: 350,
          progress: 0,
          estimatedTime: '20 minutes',
          difficulty: 'Beginner',
          prerequisites: ['Wallet connection'],
          bannerImage: images.quest,
          category: 'Community',
          partner: 'SolQuest',
          partnerLogo: images.solquest,
          hasNFT: true,
          createdAt: '2025-03-20T10:00:00Z',
          updatedAt: '2025-04-02T14:30:00Z',
          completions: 1823,
          tasks: [
            {
              id: 'follow-solquest',
              title: 'Follow SolQuest X profile',
              description: 'Follow the official SolQuest X/Twitter account',
              link: 'https://twitter.com/solquest',
              linkText: 'Visit SolQuest X/Twitter',
              completed: false
            },
            {
              id: 'join-discord',
              title: 'Join SolQuest Discord',
              description: 'Join the SolQuest Discord community to connect with other explorers',
              link: 'https://discord.gg/solquest',
              linkText: 'Join Discord Server',
              completed: false
            },
            {
              id: 'mint-nft',
              title: 'Mint SolQuest Explorer NFT',
              description: 'Mint your SolQuest Explorer NFT to unlock exclusive quests and rewards',
              link: 'https://solquest.io/mint',
              linkText: 'Mint NFT',
              completed: false
            }
          ]
        };
      }
      
      setQuest(mockQuest);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleQuestComplete = () => {
    setQuestCompleted(true);
  };
  
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-green"></div>
        </div>
      ) : (
        <>
          <div className="relative h-80 overflow-hidden">
            <img 
              src={quest.bannerImage} 
              alt={quest.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6">
              <div className="flex items-center mb-2">
                <span className="bg-solana-purple text-white text-xs font-bold px-2 py-1 rounded mr-2">
                  {quest.category}
                </span>
                <span className="bg-gray-800 text-gray-300 text-xs font-medium px-2 py-1 rounded flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quest.estimatedTime}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">{quest.title}</h1>
              
              <div className="flex items-center">
                {quest.partner && (
                  <div className="flex items-center mr-4">
                    <span className="text-gray-400 text-sm mr-2">Powered by</span>
                    <div className="bg-white rounded-full h-6 w-6 flex items-center justify-center p-1">
                      <img src={quest.partnerLogo} alt={quest.partner} className="h-full" />
                    </div>
                    <span className="text-white text-sm ml-1">{quest.partner}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-gray-400">{quest.completions.toLocaleString()} completions</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="text-xl font-bold text-white mb-4">About This Quest</h2>
                <div 
                  className="text-gray-300 space-y-4 mb-6"
                  dangerouslySetInnerHTML={{ __html: quest.fullDescription }}
                />
                
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {quest.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Quest Tasks Section - Added */}
                <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg mb-8">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quest Tasks</h2>
                    <div className="space-y-4">
                      {quest.tasks && quest.tasks.map((task, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-solana-green transition-colors">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 mt-1">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">{task.title}</h3>
                              <p className="text-gray-300 mb-3">{task.description}</p>
                              <a 
                                href={task.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-solana-purple hover:bg-solana-purple/80 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <span>{task.linkText}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                            <div className="ml-2">
                              <div className={`h-6 w-6 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-600'} flex items-center justify-center`}>
                                {task.completed ? (
                                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span className="text-white text-xs">?</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => setShowValidation(true)}
                        className="bg-gradient-to-r from-solana-purple to-solana-green hover:from-solana-green hover:to-solana-purple text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
                      >
                        Start Quest Validation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="sticky top-4">
                  <QuestValidation quest={quest} onComplete={handleQuestComplete} />
                  
                  <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg mb-6">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-white mb-4">Rewards</h2>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-solana-green/20 rounded-full flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-solana-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-solana-green font-bold text-lg">{quest.reward}</div>
                          <div className="text-gray-400 text-sm">SOL Reward</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-solana-purple/20 rounded-full flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-solana-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-solana-purple font-bold text-lg">{quest.xp} XP</div>
                          <div className="text-gray-400 text-sm">Experience Points</div>
                        </div>
                      </div>
                      
                      {quest.hasNFT && (
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-yellow-500 font-bold text-lg">Completion NFT</div>
                            <div className="text-gray-400 text-sm">Available after completion</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-dark-card rounded-xl overflow-hidden shadow-lg">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-white mb-4">Share Quest</h2>
                      <p className="text-gray-300 mb-4">
                        Invite friends to complete this quest and earn 0.05 SOL for each referral!
                      </p>
                      
                      {connected ? (
                        <>
                          <div className="mb-4">
                            <div className="bg-gray-800 p-3 rounded-lg mb-2 flex items-center justify-between">
                              <span className="text-gray-300 font-mono text-sm truncate">{window.location.href}</span>
                              <button 
                                onClick={() => {
                                  const { copyReferralLink } = require('../hooks/useReferrals').default();
                                  copyReferralLink();
                                }}
                                className="ml-2 bg-solana-purple hover:bg-solana-purple/80 text-white px-3 py-1 rounded-lg text-sm"
                              >
                                Copy
                              </button>
                            </div>
                            <Link 
                              to="/referrals" 
                              className="text-solana-green hover:text-solana-green/80 text-sm flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              View your referral dashboard
                            </Link>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </button>
                            <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => {
                                const { copyReferralLink } = require('../hooks/useReferrals').default();
                                copyReferralLink();
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg flex items-center justify-center"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                          <p className="text-gray-300 mb-3">Connect your wallet to get your referral link</p>
                          <button className="bg-solana-purple hover:bg-solana-purple/80 text-white px-4 py-2 rounded-lg">
                            Connect Wallet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestDetails;
