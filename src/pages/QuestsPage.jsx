import React, { useState, useEffect } from 'react';
import QuestCard from '../components/QuestCard';
import { useWallet } from '@solana/wallet-adapter-react';

// Import quest images
import solanaBasicsImg from '../assets/images/solana-basics.svg';
import solquestProjectImg from '../assets/images/solquest-project.svg';
import defiExplorerImg from '../assets/images/defi-explorer.svg';
import nftCreationImg from '../assets/images/nft-creation.svg';
import stakingBasicsImg from '../assets/images/staking-basics.svg';

// Import partner logos
import phantomLogo from '../assets/images/partners/phantom.svg';
import solflareLogo from '../assets/images/partners/solflare.svg';
import magicedenLogo from '../assets/images/partners/magiceden.svg';
import orcaLogo from '../assets/images/partners/orca.svg';
import marinadeLogo from '../assets/images/partners/marinade.svg';

function QuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { connected } = useWallet();
  
  const categories = ['All', 'DeFi', 'NFT', 'Staking', 'Security', 'Community', 'Development', 'Education'];

  // Simulate loading data from API
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Sample quests data - only two quests as requested
  const questsData = [
    {
      id: 'solana-basics',
      title: 'Solana Basics',
      description: 'Complete essential Solana tasks: Follow Solana on X and have at least 0.1 SOL in your wallet',
      reward: '0.5 SOL',
      image: solanaBasicsImg,
      category: 'Education',
      completed: false,
      progress: connected ? 35 : 0,
      featured: true,
      xp: 250,
      partner: {
        name: 'Phantom',
        logo: phantomLogo,
        website: 'https://phantom.app'
      }
    },
    {
      id: 'solquest-project',
      title: 'SolQuest Project',
      description: 'Join the SolQuest community: Follow on X, join Discord, and mint the SolQuest Explorer NFT',
      reward: '0.75 SOL + Exclusive NFT',
      image: solquestProjectImg,
      category: 'Community',
      completed: false,
      progress: connected ? 15 : 0,
      featured: true,
      hasNFT: true,
      xp: 350,
      partner: {
        name: 'SolQuest',
        logo: solquestProjectImg,
        website: 'https://solquest.io'
      }
    }
  ];

  // Filter quests based on search term and category
  const filteredQuests = questsData.filter(quest => {
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
          <h2 className="text-2xl font-semibold text-white mb-4">All Quests</h2>
          {filteredQuests.length === 0 ? (
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
