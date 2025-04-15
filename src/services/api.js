/**
 * SolQuest API Service
 * Handles all API calls to the SolQuest backend
 */
import axios from 'axios';

// API Configuration
const IS_DEV = import.meta.env.DEV || process.env.NODE_ENV === 'development';

// Development vs Production URLs
const DEV_API_URL = 'http://localhost:5000';
const PROD_PRIMARY_API_URL = 'https://solquest.io'; // Main domain with API routes
const PROD_FALLBACK_API_URL = 'https://solquest-app-new.vercel.app'; // Vercel deployment URL as fallback

// Use environment variables if available, otherwise use defaults
const PRIMARY_API_URL = IS_DEV
  ? (import.meta.env.VITE_DEV_API_URL || DEV_API_URL)
  : (import.meta.env.VITE_API_URL || PROD_PRIMARY_API_URL);

const FALLBACK_API_URL = IS_DEV
  ? DEV_API_URL
  : PROD_FALLBACK_API_URL;

// Function to check if the primary API is accessible
const checkApiConnection = async (url) => {
  try {
    console.log(`Checking API connection to ${url}/api/health`);
    const response = await fetch(`${url}/api/health`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // Add a cache-busting parameter to avoid cached responses
      cache: 'no-cache'
    });
    
    if (response.ok) {
      // Parse the response to check database connection status
      const data = await response.json();
      console.log('API health check response:', data);
      
      // Only consider the API accessible if the database is connected
      if (data.database && data.database.status === 'connected') {
        console.log('Database connection verified');
        return true;
      } else {
        console.warn('API is accessible but database is not connected');
        return false;
      }
    }
    
    console.warn(`API health check failed with status: ${response.status}`);
    return false;
  } catch (error) {
    console.warn(`API connection check failed for ${url}:`, error.message);
    return false;
  }
};

// Determine which API URL to use (will be set after initialization)
let API_URL = PRIMARY_API_URL;
let isApiInitialized = false;
let initializationPromise = null;

// Function to initialize API connection
const initializeApiConnection = async () => {
  if (isApiInitialized) {
    return API_URL;
  }
  
  if (initializationPromise) {
    return initializationPromise;
  }
  
  console.log('Initializing API connection...');
  initializationPromise = (async () => {
    // First try the primary URL
    console.log(`Trying primary API at ${PRIMARY_API_URL}`);
    const isPrimaryAccessible = await checkApiConnection(PRIMARY_API_URL);
    
    if (isPrimaryAccessible) {
      console.log(`✅ Successfully connected to primary API at ${PRIMARY_API_URL}`);
      API_URL = PRIMARY_API_URL;
    } else {
      // If primary fails, try the fallback URL
      console.log(`Primary API failed, trying fallback URL: ${FALLBACK_API_URL}`);
      const isFallbackAccessible = await checkApiConnection(FALLBACK_API_URL);
      
      if (isFallbackAccessible) {
        console.log(`✅ Successfully connected to fallback API at ${FALLBACK_API_URL}`);
        API_URL = FALLBACK_API_URL;
      } else {
        console.error('❌ All API endpoints are inaccessible. Using primary URL as default.');
        API_URL = PRIMARY_API_URL;
      }
    }
    
    isApiInitialized = true;
    initializationPromise = null;
    return API_URL;
  })();
  
  return initializationPromise;
};

// Initialize API connection immediately
initializeApiConnection().then(url => {
  console.log(`API initialized with URL: ${url}`);
}).catch(err => {
  console.error('API initialization error:', err);
});

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
  async (config) => {
    // Wait for API initialization to complete before proceeding
    try {
      // This ensures we have the correct API_URL before making the request
      await initializeApiConnection();
      
      // Update the baseURL before each request to ensure we're using the correct one
      config.baseURL = API_URL;
      console.log(`Making request to: ${config.baseURL}${config.url}`);
      
      const token = localStorage.getItem('solquest_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
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
