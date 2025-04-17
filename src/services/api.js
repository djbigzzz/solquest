/**
 * SolQuest API Service
 * Handles all API calls to the SolQuest backend
 */
import axios from 'axios';

// Standardized API configuration
// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : 'https://api.solquest.io/api'; // fallback for safety

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 15000,
  withCredentials: true
});

// Enhanced request interceptor
axiosInstance.interceptors.request.use(
  config => {
    console.log('[API] Request:', config.method.toUpperCase(), config.url);
    const token = localStorage.getItem('solquest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Auth token attached');
    }
    return config;
  },
  error => {
    console.error('[API] Request setup error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log('[API] Response:', response.status, response.config.url);
    return response;
  },
  error => {
    if (error.response) {
      console.error('[API] Error Response:', {
        status: error.response.status,
        url: error.response.config.url,
        data: error.response.data
      });
    } else {
      console.error('[API] Network Error:', error.message);
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('solquest_token');
      window.location.reload(); // Force auth reset
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const checkHealth = () => axiosInstance.get('/health');
export const checkDbConnection = () => axiosInstance.get('/db-connect');
export const getQuests = () => axiosInstance.get('/quests');
export const getUsers = () => axiosInstance.get('/users');

// Auth API
export const authAPI = {
  login: async (walletAddress, signature) => {
    try {
      const response = await axiosInstance.post('/auth/login', { walletAddress, signature });
      if (response.data.token) {
        localStorage.setItem('solquest_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('solquest_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the API call fails
      localStorage.removeItem('solquest_token');
      throw error;
    }
  },
  
  getAuthStatus: async () => {
    try {
      const response = await axiosInstance.get('/auth/status');
      return response.data;
    } catch (error) {
      console.error('Auth status error:', error);
      throw error;
    }
  }
};

// Quests API
export const questsAPI = {
  getAllQuests: async () => {
    try {
      const response = await axiosInstance.get('/quests');
      return response.data;
    } catch (error) {
      console.error('Get quests error:', error);
      throw error;
    }
  },
  
  getQuestById: async (questId) => {
    try {
      const response = await axiosInstance.get(`/quests/${questId}`);
      return response.data;
    } catch (error) {
      console.error(`Get quest ${questId} error:`, error);
      throw error;
    }
  },
  
  startQuest: async (questId) => {
    try {
      const response = await axiosInstance.post(`/quests/${questId}/start`);
      return response.data;
    } catch (error) {
      console.error(`Start quest ${questId} error:`, error);
      throw error;
    }
  },
  
  completeQuestStep: async (questId, stepId, proofData) => {
    try {
      const response = await axiosInstance.post(`/quests/${questId}/steps/${stepId}/complete`, { proofData });
      return response.data;
    } catch (error) {
      console.error(`Complete quest step error:`, error);
      throw error;
    }
  }
};

// User API
export const userAPI = {
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },
  
  updateUserProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  getUserQuestProgress: async () => {
    try {
      const response = await axiosInstance.get('/users/quests');
      return response.data;
    } catch (error) {
      console.error('Get user quests error:', error);
      throw error;
    }
  }
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (limit = 10, page = 1) => {
    try {
      const response = await axiosInstance.get('/leaderboard', { params: { limit, page } });
      return response.data;
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }
};

// Referral API
export const referralAPI = {
  getReferralCode: async () => {
    try {
      const response = await axiosInstance.get('/referrals/code');
      return response.data;
    } catch (error) {
      console.error('Get referral code error:', error);
      throw error;
    }
  },
  
  getReferralStats: async () => {
    try {
      const response = await axiosInstance.get('/referrals/stats');
      return response.data;
    } catch (error) {
      console.error('Get referral stats error:', error);
      throw error;
    }
  },
  
  applyReferralCode: async (referralCode) => {
    try {
      const response = await axiosInstance.post('/referrals/apply', { referralCode });
      return response.data;
    } catch (error) {
      console.error('Apply referral code error:', error);
      throw error;
    }
  }
};

// Progress API
export const progressAPI = {
  getUserProgress: async () => {
    try {
      const response = await axiosInstance.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Get user progress error:', error);
      throw error;
    }
  },
  
  updateTwitterQuest: async (progressData) => {
    try {
      const response = await axiosInstance.post('/progress/twitter', progressData);
      return response.data;
    } catch (error) {
      console.error('Update Twitter quest progress error:', error);
      throw error;
    }
  },
  
  updateNFTQuest: async (progressData) => {
    try {
      const response = await axiosInstance.post('/progress/nft', progressData);
      return response.data;
    } catch (error) {
      console.error('Update NFT quest progress error:', error);
      throw error;
    }
  },
  
  claimQuestRewards: async (questData) => {
    try {
      const response = await axiosInstance.post('/progress/claim-rewards', questData);
      return response.data;
    } catch (error) {
      console.error('Claim quest rewards error:', error);
      throw error;
    }
  }
};

// Export all APIs
export default {
  auth: authAPI,
  quests: questsAPI,
  user: userAPI,
  leaderboard: leaderboardAPI,
  referral: referralAPI,
  progress: progressAPI
};
