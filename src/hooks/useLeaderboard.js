import { useState, useEffect, useCallback } from 'react';
import { leaderboardAPI } from '../services/api';

/**
 * Custom hook for fetching and managing leaderboard data from the SolQuest backend
 */
export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leaderboardAPI.getLeaderboard(limit, page);
      
      setLeaderboardData(response.data);
      setPagination({
        currentPage: page,
        totalPages: response.pagination.totalPages,
        totalUsers: response.pagination.totalUsers,
        limit
      });
      
      return response;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLeaderboard(newPage, pagination.limit);
  }, [fetchLeaderboard, pagination.limit, pagination.totalPages]);

  // Change items per page
  const changeLimit = useCallback((newLimit) => {
    fetchLeaderboard(1, newLimit);
  }, [fetchLeaderboard]);

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboardData,
    loading,
    error,
    pagination,
    fetchLeaderboard,
    changePage,
    changeLimit
  };
};

export default useLeaderboard;
