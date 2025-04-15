import React from 'react';
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
