import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import QuestsPage from './pages/QuestsPage';
import ProjectQuestsPage from './pages/ProjectQuestsPage';
import ProfilePage from './pages/ProfilePage';
import SocialConnectionsPage from './pages/SocialConnectionsPage';
import WalletContextProvider from './context/WalletContextProvider';
import AdminMonitor from './pages/AdminMonitor';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate initialization
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#18192A]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-[#7B5FFF] mb-4">Loading...</div>
            <div className="text-[#a8ffb0]">Initializing SolQuest...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#18192A]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center p-8 bg-[#2a1919] rounded-lg border border-[#ff6b6b]">
            <h2 className="text-[#ff6b6b] mb-4">Error Loading Application</h2>
            <p className="text-[#ff6b6b] mb-4">{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#7B5FFF] text-white px-4 py-2 rounded hover:bg-[#6245e6]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <Route path="/project/:projectSlug" element={<ProjectQuestsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/social-connections" element={<SocialConnectionsPage />} />
              <Route path="/admin/monitor" element={<AdminMonitor />} />
            </Routes>
          </main>
        </div>
      </div>
    </WalletContextProvider>
  );
}

export default App;
