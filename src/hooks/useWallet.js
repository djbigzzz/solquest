import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const useSolanaWallet = () => {
  const { 
    publicKey, 
    connected, 
    connecting, 
    disconnect, 
    select, 
    wallet, 
    wallets, 
    connect,
    disconnecting,
    sendTransaction,
    signTransaction,
    signMessage,
    signAllTransactions
  } = useWallet();

  // Format the wallet address to a shorter version
  const formatWalletAddress = useCallback(() => {
    if (!publicKey) return '';
    const address = publicKey.toString();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [publicKey]);

  // Format SOL balance with proper decimal places
  const formatSolBalance = useCallback((balance) => {
    if (balance === null || balance === undefined) return '0';
    return (balance / LAMPORTS_PER_SOL).toFixed(2);
  }, []);

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    wallet,
    wallets,
    connect,
    disconnecting,
    sendTransaction,
    signTransaction,
    signMessage,
    signAllTransactions,
    formatWalletAddress,
    formatSolBalance
  };
};

export default useSolanaWallet;
