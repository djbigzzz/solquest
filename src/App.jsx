import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import QuestsPage from './pages/QuestsPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import QuestDetail from './pages/QuestDetail';
import QuestDetails from './pages/QuestDetails';
import NotificationsPanel from './components/NotificationsPanel';
import WalletContextProvider from './context/WalletContextProvider';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import NFTPurchase from './pages/NFTPurchase';
import Referrals from './pages/Referrals';
import ToastProvider from './components/ToastProvider';
import useReferralCheck from './hooks/useReferralCheck';

function App() {
  // Check for referrals when the app loads
  useReferralCheck();
  
  return (
    <WalletContextProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/quest/:questId" element={<QuestDetails />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/nft/purchase" element={<NFTPurchase />} />
              <Route path="/referrals" element={<Referrals />} />
            </Routes>
          </main>
          <NotificationsPanel />
        </div>
        <ToastProvider />
      </div>
    </WalletContextProvider>
  );
}

export default App;
