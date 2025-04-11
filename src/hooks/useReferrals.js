import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';

/**
 * Custom hook to manage user referrals
 */
const useReferrals = () => {
  const { publicKey } = useWallet();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Generate or fetch referral code when wallet connects
  useEffect(() => {
    if (publicKey) {
      // In a real app, you would fetch this from your backend
      // For now, we'll generate a code based on the wallet address
      const walletAddress = publicKey.toString();
      const code = walletAddress.substring(0, 8); // First 8 chars of wallet address
      setReferralCode(code);
      
      // Create referral link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}?ref=${code}`;
      setReferralLink(link);
      
      // Simulate fetching referral count from backend
      fetchReferralCount(code);
    } else {
      setReferralCode('');
      setReferralLink('');
      setReferralCount(0);
    }
  }, [publicKey]);

  // Simulate fetching referral count from backend
  const fetchReferralCount = (code) => {
    setIsLoading(true);
    
    // Mock API call - in a real app, this would be a backend call
    setTimeout(() => {
      // Generate a random number between 0 and 20 for demo purposes
      const count = Math.floor(Math.random() * 21);
      setReferralCount(count);
      setIsLoading(false);
    }, 1000);
  };

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

  // Check if user came from a referral link
  const checkAndProcessReferral = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && publicKey) {
      // In a real app, you would send this to your backend to credit the referrer
      console.log(`User with wallet ${publicKey.toString()} was referred by code: ${refCode}`);
      
      // Remove referral parameter from URL without page refresh
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
      
      return true;
    }
    
    return false;
  };

  return {
    referralCode,
    referralCount,
    referralLink,
    isLoading,
    copyReferralLink,
    checkAndProcessReferral
  };
};

export default useReferrals;
