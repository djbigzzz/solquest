import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const CustomWalletButton = () => {
  const { select, wallets, connect, disconnect, connected, publicKey, connecting } = useWallet();
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setWalletAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
      
      // Dispatch a custom event to notify other components that wallet is connected
      window.dispatchEvent(new CustomEvent('walletConnected', { 
        detail: { address: publicKey.toString() }
      }));
      
      // Force a rerender of components that need to know about wallet connection
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('walletConnected', { 
          detail: { address: publicKey.toString() }
        }));
      }, 500);
    } else {
      setWalletAddress('');
    }
  }, [publicKey]);
  
  // Track connecting state
  useEffect(() => {
    setIsConnecting(connecting);
  }, [connecting]);

  const handleConnect = async () => {
    if (connected) {
      try {
        await disconnect();
        // Dispatch event for wallet disconnected
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
        // Force a rerender after a short delay
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('walletDisconnected'));
        }, 500);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    } else {
      try {
        setIsConnecting(true);
        // Select Phantom wallet if available
        const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
        if (phantomWallet) {
          await select(phantomWallet.adapter.name);
          await connect();
          
          // Force a rerender after connection
          setTimeout(() => {
            if (publicKey) {
              window.dispatchEvent(new CustomEvent('walletConnected', { 
                detail: { address: publicKey.toString() }
              }));
            }
          }, 500);
        } else {
          alert('Please install Phantom wallet');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      } finally {
        setIsConnecting(false);
      }
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-gradient-to-r from-solana-purple to-solana-green text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity relative"
    >
      {isConnecting ? (
        <>
          <span className="opacity-0">Connecting...</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </>
      ) : connected ? (
        walletAddress
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default CustomWalletButton;
