import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const REFRESH_INTERVAL = 30000; // 30 seconds
const BRAND_ACCENT = '#7B5FFF';
const BRAND_BG = '#18192A';
const BRAND_CARD = '#23243A';
const BRAND_TEXT = '#FFF';

// Set your admin username/password in environment variables for production
const ADMIN_USER = process.env.REACT_APP_MONITOR_USER || 'admin';
const ADMIN_PASS = process.env.REACT_APP_MONITOR_PASS || 'solquest2025';

function AdminMonitor() {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  // Log errors to console
  useEffect(() => {
    if (error || apiError) {
      console.error('Admin Monitor Error:', {
        error,
        apiError,
        timestamp: new Date().toISOString()
      });
    }
  }, [error, apiError]);

  // Show loading state while fetching data
  const showLoading = loading || !status.health;

  // Handle API errors
  const handleApiError = (error) => {
    setApiError(error.message || 'Failed to fetch status data');
    setError(error.message || 'Failed to fetch status data');
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    setApiError(null);
    try {
      const [health, db, quests, users] = await Promise.all([
        axios.get('/api/health'),
        axios.get('/api/db-connect'),
        axios.get('/api/quests'),
        axios.get('/api/users'),
      ]);
      
      // Validate API responses
      if (!health.data || !db.data) {
        throw new Error('API response missing required data');
      }

      setStatus({
        health: health.data,
        db: db.data,
        quests: quests.data,
        questsCount: Array.isArray(quests.data) ? quests.data.length : 0,
        users: users.data,
        usersCount: Array.isArray(users.data) ? users.data.length : 0,
        lastUpdated: new Date().toLocaleString(),
      });
    } catch (err) {
      handleApiError(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: BRAND_BG, minHeight: '100vh', padding: 32, maxWidth: 1000, margin: '0 auto', color: BRAND_TEXT, fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <h1 style={{ color: BRAND_ACCENT, marginBottom: 24 }}>SolQuest Live Monitor</h1>
      
      {/* Loading State */}
      {showLoading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '24px', color: BRAND_ACCENT }}>Loading...</div>
          <div style={{ marginTop: '16px', color: '#a8ffb0' }}>Fetching system status...</div>
        </div>
      )}

      {/* API Error State */}
      {apiError && (
        <div style={{
          background: '#2a1919',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #ff6b6b'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '12px' }}>API Error</h3>
          <p style={{ color: '#ff6b6b' }}>{apiError}</p>
          <button
            onClick={() => {
              setApiError(null);
              fetchStatus();
            }}
            style={{
              background: BRAND_ACCENT,
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '12px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!showLoading && !apiError && (
        <>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatusCard label="API Health" value={status.health?.status} details={status.health?.message} ok={status.health?.status === 'ok'} />
            <StatusCard label="DB Connection" value={status.db?.database?.status} details={status.db?.database?.host} ok={status.db?.database?.status === 'connected'} />
            <StatusCard label="Quests" value={status.questsCount} details="Total quests" ok={typeof status.questsCount === 'number'} />
            <StatusCard label="Users" value={status.usersCount} details="Total users" ok={typeof status.usersCount === 'number'} />
            <StatusCard label="Last Updated" value={status.lastUpdated} ok={true} />
          </div>
          <div>
            <h2 style={{ color: BRAND_ACCENT }}>API Health Details</h2>
            <pre style={{ background: '#23243A', padding: 16, borderRadius: 8, color: '#a8ffb0' }}>{JSON.stringify(status.health, null, 2)}</pre>
          </div>
          <div>
            <h2 style={{ color: BRAND_ACCENT }}>DB Connection Details</h2>
            <pre style={{ background: '#23243A', padding: 16, borderRadius: 8, color: '#a8ffb0' }}>{JSON.stringify(status.db, null, 2)}</pre>
          </div>
        </>
      )}
      {loading ? <div>Loading...</div> : (
        <>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatusCard label="API Health" value={status.health?.status} details={status.health?.message} ok={status.health?.status === 'ok'} />
            <StatusCard label="DB Connection" value={status.db?.database?.status} details={status.db?.database?.host} ok={status.db?.database?.status === 'connected'} />
            <StatusCard label="Quests" value={status.questsCount} details="Total quests" ok={typeof status.questsCount === 'number'} />
            <StatusCard label="Users" value={status.usersCount} details="Total users" ok={typeof status.usersCount === 'number'} />
            <StatusCard label="Last Updated" value={status.lastUpdated} ok={true} />
          </div>
          <div>
            <h2 style={{ color: BRAND_ACCENT }}>API Health Details</h2>
            <pre style={{ background: '#23243A', padding: 16, borderRadius: 8, color: '#a8ffb0' }}>{JSON.stringify(status.health, null, 2)}</pre>
          </div>
          <div>
            <h2 style={{ color: BRAND_ACCENT }}>DB Connection Details</h2>
            <pre style={{ background: '#23243A', padding: 16, borderRadius: 8, color: '#a8ffb0' }}>{JSON.stringify(status.db, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}

function StatusCard({ label, value, details, ok }) {
  return (
    <div style={{
      background: ok ? '#1e4620' : '#46201e',
      color: ok ? '#a8ffb0' : '#ffb0b0',
      padding: 24,
      borderRadius: 12,
      minWidth: 160,
      minHeight: 90,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      flex: '1 0 160px',
    }}>
      <div style={{ fontWeight: 600, fontSize: 18 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {details && <div style={{ fontSize: 13, marginTop: 6 }}>{details}</div>}
    </div>
  );
}

export default AdminMonitor;
