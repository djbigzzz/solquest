import React, { useState, useEffect } from 'react';
import QuestCard from '../components/QuestCard';
import { useWallet } from '@solana/wallet-adapter-react';
import useQuests from '../hooks/useQuests';
import useAuth from '../hooks/useAuth';

// Import quest images for fallback
import solanaBasicsImg from '../assets/images/solana-basics.svg';
import solquestProjectImg from '../assets/images/solquest-project.svg';
import defiExplorerImg from '../assets/images/defi-explorer.svg';
import nftCreationImg from '../assets/images/nft-creation.svg';
import stakingBasicsImg from '../assets/images/staking-basics.svg';

// Import partner logos for fallback
import phantomLogo from '../assets/images/partners/phantom.svg';
import solflareLogo from '../assets/images/partners/solflare.svg';
import magicedenLogo from '../assets/images/partners/magiceden.svg';
import orcaLogo from '../assets/images/partners/orca.svg';
import marinadeLogo from '../assets/images/partners/marinade.svg';

function QuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();
  
  // Use our custom hook for quests data
  const { quests, loading: isLoading, error, fetchAllQuests } = useQuests();
  const [apiStatus, setApiStatus] = useState({ connected: false, message: '' });
  
  const categories = ['All', 'DeFi', 'NFT', 'Staking', 'Security', 'Community', 'Development', 'Education'];

  // Fetch quests data from API when component mounts
  useEffect(() => {
    const loadQuests = async () => {
      try {
        await fetchAllQuests();
        setApiStatus({ connected: true, message: 'Connected to SolQuest API' });
      } catch (err) {
        console.error('Failed to fetch quests:', err);
        setApiStatus({ 
          connected: false, 
          message: 'Unable to connect to SolQuest API. Using cached data.' 
        });
      }
    };
    
    loadQuests();
  }, [fetchAllQuests]);
  
  // Map quest images and partner logos based on quest data from API
  const getQuestImage = (questId) => {
    const imageMap = {
      'solana-basics': solanaBasicsImg,
      'solquest-project': solquestProjectImg,
      'defi-explorer': defiExplorerImg,
      'nft-creation': nftCreationImg,
      'staking-basics': stakingBasicsImg
    };
    return imageMap[questId] || solanaBasicsImg; // Default to solana basics image
  };
  
  const getPartnerLogo = (partnerName) => {
    const logoMap = {
      'Phantom': phantomLogo,
      'Solflare': solflareLogo,
      'Magic Eden': magicedenLogo,
      'Orca': orcaLogo,
      'Marinade': marinadeLogo,
      'SolQuest': solquestProjectImg
    };
    return logoMap[partnerName] || phantomLogo; // Default to phantom logo
  };
  
  // Enhance quests with images and progress data
  const enhancedQuests = quests.map(quest => ({
    ...quest,
    image: getQuestImage(quest.id),
    progress: connected && isAuthenticated ? (quest.userProgress || 0) : 0,
    partner: quest.partner ? {
      ...quest.partner,
      logo: getPartnerLogo(quest.partner.name)
    } : null
  }));

  // Filter quests based on search term and category
  const filteredQuests = enhancedQuests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || quest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Quests</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search quests..."
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-solana-purple"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-solana-purple"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* API Status Banner */}
      {!apiStatus.connected && !isLoading && (
        <div className="mb-4 p-3 bg-yellow-800/50 border border-yellow-700 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-yellow-200">{apiStatus.message}</span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-yellow-200/70">You're viewing previously loaded data. Some features may be limited.</span>
            <button 
              onClick={() => fetchAllQuests()}
              className="text-xs bg-yellow-700 hover:bg-yellow-600 text-white px-2 py-1 rounded"
            >
              Try Reconnecting
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-700 rounded-t-xl"></div>
              <div className="p-4 bg-gray-800 rounded-b-xl">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Featured Quests Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Featured Quests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuests
                .filter(quest => quest.featured)
                .map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
            </div>
          </div>

          {/* All Quests Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">All Quests</h2>
            {!apiStatus.connected && quests.length > 0 && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                Cached Data
              </span>
            )}
          </div>
          {error && !quests.length ? (
            <div className="text-center py-12">
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-lg">Error loading quests</p>
                <p className="text-gray-400 mt-2">{error.message || 'Failed to connect to the SolQuest API'}</p>
                <p className="text-gray-400 mt-2 text-sm">No cached data is available. Please check your internet connection.</p>
                <button 
                  onClick={() => fetchAllQuests()}
                  className="mt-4 bg-solana-purple text-white px-4 py-2 rounded-lg hover:bg-solana-purple/80"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredQuests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No quests found. Try adjusting your search.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="mt-4 text-solana-purple hover:text-solana-green"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuests
                .filter(quest => !quest.featured || selectedCategory !== 'All' || searchTerm)
                .map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default QuestsPage;
