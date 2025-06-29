import React, { useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from './ui/Button';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { useGlobalStore } from '../store/globalStore';

export const WalletConnect: React.FC = () => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWalletConnection();
  const { theme } = useGlobalStore();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className={`text-sm font-mono ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDisconnect}
          className={`${
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
      disabled={isConnecting}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
    >
      {isConnecting ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};