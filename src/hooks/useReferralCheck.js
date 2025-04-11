import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';

/**
 * Custom hook to check for referral parameters in the URL
 * and process them when a wallet is connected
 */
const useReferralCheck = () => {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      checkForReferral();
    }
  }, [connected, publicKey]);

  const checkForReferral = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // In a real app, you would send this to your backend
      console.log(`User with wallet ${publicKey.toString()} was referred by code: ${refCode}`);
      
      // Show a toast notification
      toast.success('Referral detected! You will receive a 10% bonus on quest rewards.');
      
      // Remove referral parameter from URL without page refresh
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
      
      // Store referral info in localStorage for persistence
      localStorage.setItem('solquest_referrer', refCode);
      
      return true;
    }
    
    return false;
  };

  return { checkForReferral };
};

export default useReferralCheck;
