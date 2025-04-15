/**
 * SolQuest API Service
 * Handles all API calls to the SolQuest backend
 */
import axios from 'axios';

// API Configuration
const PRIMARY_API_URL = import.meta.env.VITE_API_URL || 'https://api.solquest.io';
const FALLBACK_API_URL = 'https://solquest-dfseffz2e-mystartup-team.vercel.app'; // Updated Vercel deployment URL as fallback

// Function to check if the primary API is accessible
const checkApiConnection = async (url) => {
  try {
    const response = await fetch(`${url}/api/health`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`API connection check failed for ${url}:`, error.message);
    return false;
  }
};

// Determine which API URL to use (will be set after initialization)
let API_URL = PRIMARY_API_URL;

// Initialize API connection check
(async () => {
  const isPrimaryAccessible = await checkApiConnection(PRIMARY_API_URL);
  if (!isPrimaryAccessible) {
    console.log(`Primary API at ${PRIMARY_API_URL} is not accessible, using fallback URL: ${FALLBACK_API_URL}`);
    API_URL = FALLBACK_API_URL;
  } else {
    console.log(`Using primary API at ${PRIMARY_API_URL}`);
  }
})();

// Create axios instance with default config
const apiClient = axios.create({
  // baseURL will be updated after the connection check
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling authentication cookies
});

// Request interceptor for adding auth token and updating baseURL
apiClient.interceptors.request.use(
  (config) => {
    // Update the baseURL before each request to ensure we're using the correct one
    config.baseURL = API_URL;
    
    const token = localStorage.getItem('solquest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if needed
      localStorage.removeItem('solquest_token');
      // You might want to redirect to login or trigger a refresh token flow here
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (walletAddress, signature) => {
    try {
      const response = await apiClient.post('/api/auth/login', { walletAddress, signature });
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
      await apiClient.post('/api/auth/logout');
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
      const response = await apiClient.get('/api/auth/status');
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
      const response = await apiClient.get('/api/quests');
      return response.data;
    } catch (error) {
      console.error('Get quests error:', error);
      throw error;
    }
  },
  
  getQuestById: async (questId) => {
    try {
      const response = await apiClient.get(`/api/quests/${questId}`);
      return response.data;
    } catch (error) {
      console.error(`Get quest ${questId} error:`, error);
      throw error;
    }
  },
  
  startQuest: async (questId) => {
    try {
      const response = await apiClient.post(`/api/quests/${questId}/start`);
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
