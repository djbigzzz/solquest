import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  const [isConnected, setIsConnected] = useState(false);

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );
  
  // Handle wallet connection events
  const onWalletConnect = useCallback((wallet) => {
    console.log('Wallet connected:', wallet);
    setIsConnected(true);
    
    // Dispatch global event
    window.dispatchEvent(new CustomEvent('walletConnected', { 
      detail: { address: wallet?.publicKey?.toString() }
    }));
  }, []);

  const onWalletDisconnect = useCallback(() => {
    console.log('Wallet disconnected');
    setIsConnected(false);
    
    // Dispatch global event
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => console.error('Wallet error:', error)}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
