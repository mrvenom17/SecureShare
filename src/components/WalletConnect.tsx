import React, { useEffect } from 'react';
import { WalletIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { useGlobalStore } from '../store/globalStore';

export const WalletConnect: React.FC = () => {
  const { address, isConnected, connect, disconnect } = useWalletConnection();
  const { setUser, addNotification, theme } = useGlobalStore();

  useEffect(() => {
    if (isConnected && address) {
      const user = {
        id: crypto.randomUUID(),
        walletAddress: address,
        role: 'user' as const,
        permissions: ['files.read', 'files.write', 'files.share'],
        lastActive: Date.now()
      };
      setUser(user);
      
      addNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: 'Successfully connected to your wallet'
      });
    } else {
      setUser(null);
    }
  }, [isConnected, address, setUser, addNotification]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Failed to connect wallet. Please try again.'
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      addNotification({
        type: 'info',
        title: 'Wallet Disconnected',
        message: 'Your wallet has been disconnected'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Disconnection Failed',
        message: 'Failed to disconnect wallet'
      });
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDisconnect}
          className={`flex items-center gap-2 ${
            theme === 'dark' 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
    >
      <WalletIcon className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
};