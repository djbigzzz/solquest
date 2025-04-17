import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { authAPI } from '../services/api';
import { bs58 } from 'bs58';
import { sign } from 'tweetnacl';

/**
 * Custom hook for handling authentication with the SolQuest backend
 */
export const useAuth = () => {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    if (!localStorage.getItem('solquest_token')) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.getAuthStatus();
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('solquest_token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with wallet
  const login = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) {
      setError('Wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Request nonce and message from backend
      const nonceResponse = await authAPI.getNonce(publicKey.toString());
      const { nonce, message } = nonceResponse;
      if (!nonce || !message) {
        setError('Failed to retrieve authentication challenge from server.');
        setLoading(false);
        return false;
      }

      // 2. Ask wallet to sign the backend-provided message
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);

      // 3. Send signature and wallet address to backend for verification
      const response = await authAPI.login(publicKey.toString(), signature);

      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, signMessage]);

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      // Optionally disconnect wallet too
      disconnect();
    }
  }, [disconnect]);

  // Check auth status on mount and when wallet connection changes
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus, connected]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus
  };
};

export default useAuth;
