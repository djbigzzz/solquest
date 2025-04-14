/**
 * Cache Utilities for SolQuest
 * 
 * This module provides utilities for caching API responses locally
 * to ensure the app can function even when the backend is not accessible.
 */

// Cache keys
const CACHE_KEYS = {
  QUESTS: 'solquest_quests_cache',
  QUEST_DETAILS: 'solquest_quest_details_cache',
  LEADERBOARD: 'solquest_leaderboard_cache',
  USER_PROFILE: 'solquest_user_profile_cache',
  REFERRALS: 'solquest_referrals_cache',
};

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Save data to cache with expiration
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const saveToCache = (key, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

/**
 * Get data from cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getFromCache = (key) => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;
    
    const { data, timestamp } = JSON.parse(cachedItem);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

/**
 * Clear a specific cache item
 * @param {string} key - Cache key
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all SolQuest cache items
 */
export const clearAllCache = () => {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Save quest data to cache
 * @param {Array} quests - Array of quest objects
 */
export const cacheQuests = (quests) => {
  saveToCache(CACHE_KEYS.QUESTS, quests);
};

/**
 * Get cached quests
 * @returns {Array|null} - Cached quests or null
 */
export const getCachedQuests = () => {
  return getFromCache(CACHE_KEYS.QUESTS);
};

/**
 * Save quest detail to cache
 * @param {string} questId - Quest ID
 * @param {Object} questData - Quest detail object
 */
export const cacheQuestDetail = (questId, questData) => {
  const questDetails = getFromCache(CACHE_KEYS.QUEST_DETAILS) || {};
  questDetails[questId] = questData;
  saveToCache(CACHE_KEYS.QUEST_DETAILS, questDetails);
};

/**
 * Get cached quest detail
 * @param {string} questId - Quest ID
 * @returns {Object|null} - Cached quest detail or null
 */
export const getCachedQuestDetail = (questId) => {
  const questDetails = getFromCache(CACHE_KEYS.QUEST_DETAILS);
  return questDetails ? questDetails[questId] : null;
};

/**
 * Save leaderboard data to cache
 * @param {Array} leaderboard - Leaderboard data
 */
export const cacheLeaderboard = (leaderboard) => {
  saveToCache(CACHE_KEYS.LEADERBOARD, leaderboard);
};

/**
 * Get cached leaderboard
 * @returns {Array|null} - Cached leaderboard or null
 */
export const getCachedLeaderboard = () => {
  return getFromCache(CACHE_KEYS.LEADERBOARD);
};

/**
 * Save user profile to cache
 * @param {Object} profile - User profile data
 */
export const cacheUserProfile = (profile) => {
  saveToCache(CACHE_KEYS.USER_PROFILE, profile);
};

/**
 * Get cached user profile
 * @returns {Object|null} - Cached user profile or null
 */
export const getCachedUserProfile = () => {
  return getFromCache(CACHE_KEYS.USER_PROFILE);
};

/**
 * Save referrals data to cache
 * @param {Object} referrals - Referrals data
 */
export const cacheReferrals = (referrals) => {
  saveToCache(CACHE_KEYS.REFERRALS, referrals);
};

/**
 * Get cached referrals
 * @returns {Object|null} - Cached referrals or null
 */
export const getCachedReferrals = () => {
  return getFromCache(CACHE_KEYS.REFERRALS);
};

export default {
  CACHE_KEYS,
  saveToCache,
  getFromCache,
  clearCache,
  clearAllCache,
  cacheQuests,
  getCachedQuests,
  cacheQuestDetail,
  getCachedQuestDetail,
  cacheLeaderboard,
  getCachedLeaderboard,
  cacheUserProfile,
  getCachedUserProfile,
  cacheReferrals,
  getCachedReferrals,
};
