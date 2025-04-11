import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const CustomWalletButton = () => {
  const { select, wallets, connect, disconnect, connected, publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setWalletAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
    } else {
      setWalletAddress('');
    }
  }, [publicKey]);

  const handleConnect = async () => {
    if (connected) {
      disconnect();
    } else {
      // Select Phantom wallet if available
      const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
      if (phantomWallet) {
        await select(phantomWallet.adapter.name);
        await connect();
      } else {
        alert('Please install Phantom wallet');
      }
    }
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-gradient-to-r from-solana-purple to-solana-green text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      {connected ? walletAddress : 'Connect Wallet'}
    </button>
  );
};

export default CustomWalletButton;
