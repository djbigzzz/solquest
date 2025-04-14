import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';
import useAuth from './useAuth';

/**
 * Custom hook for managing user profile data from the SolQuest backend
 */
export const useUserProfile = () => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [questProgress, setQuestProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getUserProfile();
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!isAuthenticated) return null;
    
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.updateUserProfile(profileData);
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch user quest progress
  const fetchQuestProgress = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getUserQuestProgress();
      setQuestProgress(data);
      return data;
    } catch (err) {
      console.error('Error fetching quest progress:', err);
      setError('Failed to load quest progress. Please try again later.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch profile and quest progress when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchQuestProgress();
    } else {
      setProfile(null);
      setQuestProgress([]);
    }
  }, [isAuthenticated, fetchProfile, fetchQuestProgress]);

  return {
    profile,
    questProgress,
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchQuestProgress
  };
};

export default useUserProfile;
