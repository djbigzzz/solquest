import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { referralAPI } from '../services/api';
import useAuth from './useAuth';

/**
 * Custom hook to manage user referrals
 */
const useReferrals = () => {
  const { publicKey } = useWallet();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  // Fetch referral code from backend
  const fetchReferralCode = useCallback(async () => {
    if (!publicKey || !isAuthenticated) {
      setReferralCode('');
      setReferralLink('');
      setReferralCount(0);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await referralAPI.getReferralCode();
      
      if (response && response.code) {
        setReferralCode(response.code);
        
        // Create referral link
        const baseUrl = window.location.origin;
        const link = `${baseUrl}?ref=${response.code}`;
        setReferralLink(link);
        
        // Fetch referral stats
        fetchReferralStats();
      }
    } catch (error) {
      console.error('Error fetching referral code:', error);
      toast.error('Failed to load your referral code');
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, isAuthenticated]);
  
  // Generate or fetch referral code when wallet connects and user is authenticated
  useEffect(() => {
    fetchReferralCode();
  }, [fetchReferralCode, publicKey, isAuthenticated]);

  // Fetch referral stats from backend
  const fetchReferralStats = useCallback(async () => {
    if (!publicKey || !isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await referralAPI.getReferralStats();
      
      if (response) {
        setReferralCount(response.count || 0);
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, isAuthenticated]);

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          toast.success('Referral link copied to clipboard!');
        })
        .catch(err => {
          toast.error('Failed to copy referral link');
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Check if user came from a referral link and process it
  const checkAndProcessReferral = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && publicKey && isAuthenticated) {
      try {
        // Send referral code to backend
        await referralAPI.applyReferralCode(refCode);
        toast.success('Referral applied successfully!');
        
        // Remove referral parameter from URL without page refresh
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
        
        return true;
      } catch (error) {
        console.error('Error applying referral code:', error);
        toast.error('Failed to apply referral code');
        return false;
      }
    }
    
    return false;
  }, [publicKey, isAuthenticated]);

  return {
    referralCode,
    referralCount,
    referralLink,
    isLoading,
    copyReferralLink,
    checkAndProcessReferral,
    fetchReferralCode,
    fetchReferralStats
  };
};

export default useReferrals;
