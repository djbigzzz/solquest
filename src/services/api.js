/**
 * SolQuest API Service
 * Handles all API calls to the SolQuest backend
 */
import axios from 'axios';

// Set API base URL from environment variable or use default
// Use Vite's import.meta.env for environment variables
const IS_DEV = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://solquest.io';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds
  withCredentials: true // Important for handling authentication cookies
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('solquest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error (No Response):', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const checkHealth = () => axiosInstance.get('/api/health');
export const checkDbConnection = () => axiosInstance.get('/api/db-connect');
export const getQuests = () => axiosInstance.get('/api/quests');
export const getUsers = () => axiosInstance.get('/api/users');

// Auth API
export const authAPI = {
  login: async (walletAddress, signature) => {
    try {
      const response = await api.post('/api/auth/login', { walletAddress, signature });
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
      await api.post('/api/auth/logout');
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
      const response = await api.get('/api/auth/status');
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
      const response = await api.get('/api/quests');
      return response.data;
    } catch (error) {
      console.error('Get quests error:', error);
      throw error;
    }
  },
  
  getQuestById: async (questId) => {
    try {
      const response = await api.get(`/api/quests/${questId}`);
      return response.data;
    } catch (error) {
      console.error(`Get quest ${questId} error:`, error);
      throw error;
    }
  },
  
  startQuest: async (questId) => {
    try {
      const response = await api.post(`/api/quests/${questId}/start`);
      return response.data;
    } catch (error) {
      console.error(`Start quest ${questId} error:`, error);
      throw error;
    }
  },
  
  completeQuestStep: async (questId, stepId, proofData) => {
    try {
      const response = await apiClient.post(`/api/quests/${questId}/steps/${stepId}/complete`, { proofData });
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
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },
  
  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  getUserQuestProgress: async () => {
    try {
      const response = await apiClient.get('/api/users/quests');
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
      const response = await apiClient.get('/api/leaderboard', { params: { limit, page } });
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
      const response = await apiClient.get('/api/referrals/code');
      return response.data;
    } catch (error) {
      console.error('Get referral code error:', error);
      throw error;
    }
  },
  
  getReferralStats: async () => {
    try {
      const response = await apiClient.get('/api/referrals/stats');
      return response.data;
    } catch (error) {
      console.error('Get referral stats error:', error);
      throw error;
    }
  },
  
  applyReferralCode: async (referralCode) => {
    try {
      const response = await apiClient.post('/api/referrals/apply', { referralCode });
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
      const response = await apiClient.get('/api/progress');
      return response.data;
    } catch (error) {
      console.error('Get user progress error:', error);
      throw error;
    }
  },
  
  updateTwitterQuest: async (progressData) => {
    try {
      const response = await apiClient.post('/api/progress/twitter', progressData);
      return response.data;
    } catch (error) {
      console.error('Update Twitter quest progress error:', error);
      throw error;
    }
  },
  
  updateNFTQuest: async (progressData) => {
    try {
      const response = await apiClient.post('/api/progress/nft', progressData);
      return response.data;
    } catch (error) {
      console.error('Update NFT quest progress error:', error);
      throw error;
    }
  },
  
  claimQuestRewards: async (questData) => {
    try {
      const response = await apiClient.post('/api/progress/claim-rewards', questData);
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
