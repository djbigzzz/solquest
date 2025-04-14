import { useState, useEffect, useCallback } from 'react';
import { questsAPI } from '../services/api';
import { 
  cacheQuests, 
  getCachedQuests, 
  cacheQuestDetail, 
  getCachedQuestDetail 
} from '../utils/cacheUtils';

/**
 * Custom hook for fetching and managing quests from the SolQuest backend
 */
export const useQuests = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all quests
  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        const data = await questsAPI.getAllQuests();
        setQuests(data);
        // Cache the successful response
        cacheQuests(data);
        return data;
      } catch (apiError) {
        console.warn('API fetch failed, using cached quests:', apiError);
        
        // If API fails, try to use cached data
        const cachedData = getCachedQuests();
        if (cachedData) {
          console.log('Using cached quests data');
          setQuests(cachedData);
          return cachedData;
        } else {
          // If no cached data, propagate the original error
          throw apiError;
        }
      }
    } catch (err) {
      console.error('Error fetching quests:', err);
      setError({
        message: 'Failed to load quests. Please try again later.',
        original: err
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single quest by ID
  const fetchQuestById = useCallback(async (questId) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        const data = await questsAPI.getQuestById(questId);
        // Cache the successful response
        if (data) {
          cacheQuestDetail(questId, data);
        }
        return data;
      } catch (apiError) {
        console.warn(`API fetch failed for quest ${questId}, using cached data:`, apiError);
        
        // If API fails, try to use cached data
        const cachedData = getCachedQuestDetail(questId);
        if (cachedData) {
          console.log(`Using cached data for quest ${questId}`);
          return cachedData;
        } else {
          // If no cached data, try to find it in the all quests cache
          const allQuests = getCachedQuests();
          if (allQuests) {
            const questFromCache = allQuests.find(q => q.id === questId);
            if (questFromCache) {
              console.log(`Found quest ${questId} in all quests cache`);
              return questFromCache;
            }
          }
          // If still no data, propagate the original error
          throw apiError;
        }
      }
    } catch (err) {
      console.error(`Error fetching quest ${questId}:`, err);
      setError({
        message: 'Failed to load quest details. Please try again later.',
        original: err
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Start a quest
  const startQuest = useCallback(async (questId, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Try to call the API
        const result = await questsAPI.startQuest(questId, userData);
        // Refresh quests after starting a new one
        await fetchQuests();
        return result;
      } catch (apiError) {
        console.warn(`API call failed for starting quest ${questId}:`, apiError);
        
        // For offline support, we'll simulate a successful start
        // and update local state, but mark it as pending sync
        const cachedQuests = getCachedQuests() || [];
        const updatedQuests = cachedQuests.map(quest => {
          if (quest.id === questId) {
            return { ...quest, started: true, pendingSync: true };
          }
          return quest;
        });
        
        cacheQuests(updatedQuests);
        setQuests(updatedQuests);
        
        return { success: true, offline: true, message: 'Quest started in offline mode' };
      }
    } catch (err) {
      console.error(`Error starting quest ${questId}:`, err);
      setError({
        message: 'Failed to start quest. Please try again later.',
        original: err
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuests]);

  // Complete a quest step
  const completeQuestStep = useCallback(async (questId, stepId, proofData) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Try to call the API
        const result = await questsAPI.completeQuestStep(questId, stepId, proofData);
        // Refresh quests after completing a step
        await fetchQuests();
        return result;
      } catch (apiError) {
        console.warn(`API call failed for completing step ${stepId} in quest ${questId}:`, apiError);
        
        // For offline support, we'll simulate a successful completion
        // and update local state, but mark it as pending sync
        const cachedQuestDetail = getCachedQuestDetail(questId);
        if (cachedQuestDetail) {
          const updatedSubtasks = (cachedQuestDetail.subtasks || []).map(subtask => {
            if (subtask.id === stepId) {
              return { ...subtask, completed: true, pendingSync: true };
            }
            return subtask;
          });
          
          const updatedQuest = { ...cachedQuestDetail, subtasks: updatedSubtasks };
          cacheQuestDetail(questId, updatedQuest);
          
          // Also update in the all quests cache if present
          const allQuests = getCachedQuests();
          if (allQuests) {
            const updatedQuests = allQuests.map(quest => {
              if (quest.id === questId) {
                // Update progress in the quest list view
                const completedCount = updatedSubtasks.filter(s => s.completed).length;
                const totalCount = updatedSubtasks.length;
                const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                
                return { ...quest, progress, pendingSync: true };
              }
              return quest;
            });
            
            cacheQuests(updatedQuests);
            setQuests(updatedQuests);
          }
          
          return { success: true, offline: true, message: 'Step completed in offline mode' };
        }
        
        // If we couldn't update cache, propagate the error
        throw apiError;
      }
    } catch (err) {
      console.error(`Error completing quest step:`, err);
      setError({
        message: 'Failed to complete quest step. Please try again later.',
        original: err
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuests]);

  // Fetch quests on mount
  useEffect(() => {
    // Try to load cached quests immediately for better UX
    const cachedData = getCachedQuests();
    if (cachedData) {
      console.log('Using cached quests data on initial load');
      setQuests(cachedData);
      setLoading(false);
    }
    
    // Then fetch fresh data from the API
    fetchQuests();
  }, [fetchQuests]);

  // Function to complete an entire quest
  const completeQuest = useCallback(async (questId, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Try to call the API
        const result = await questsAPI.completeQuest(questId, userData);
        // Refresh quests after completing
        await fetchQuests();
        return result;
      } catch (apiError) {
        console.warn(`API call failed for completing quest ${questId}:`, apiError);
        
        // For offline support, we'll simulate a successful completion
        // and update local state, but mark it as pending sync
        const cachedQuests = getCachedQuests() || [];
        const updatedQuests = cachedQuests.map(quest => {
          if (quest.id === questId) {
            return { ...quest, completed: true, progress: 100, pendingSync: true };
          }
          return quest;
        });
        
        cacheQuests(updatedQuests);
        setQuests(updatedQuests);
        
        return { success: true, offline: true, message: 'Quest completed in offline mode' };
      }
    } catch (err) {
      console.error(`Error completing quest ${questId}:`, err);
      setError({
        message: 'Failed to complete quest. Please try again later.',
        original: err
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuests]);

  return {
    quests,
    loading,
    error,
    fetchQuests,
    fetchQuestById,
    startQuest,
    completeQuestStep,
    completeQuest
  };
};

export default useQuests;
