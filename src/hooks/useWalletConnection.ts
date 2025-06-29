import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useGlobalStore } from '../store/globalStore';

export const useWalletConnection = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { addNotification } = useGlobalStore();

  const connect = async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        addNotification({
          type: 'error',
          title: 'Browser Required',
          message: 'Wallet connection requires a browser environment'
        });
        return;
      }

      // For demo purposes, simulate wallet connection without requiring MetaMask
      const mockAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update global state with mock user
      const mockUser = {
        id: crypto.randomUUID(),
        walletAddress: mockAddress,
        role: 'user' as const,
        permissions: ['files.read', 'files.write', 'files.share'],
        lastActive: Date.now()
      };
      
      useGlobalStore.getState().setUser(mockUser);
      
      addNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: `Connected to ${mockAddress.slice(0, 8)}...${mockAddress.slice(-4)}`
      });
      
      return { address: mockAddress };
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Failed to connect wallet. Please try again.'
      });
      
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      // Clear user state
      useGlobalStore.getState().setUser(null);
      
      addNotification({
        type: 'info',
        title: 'Wallet Disconnected',
        message: 'Your wallet has been disconnected'
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      
      addNotification({
        type: 'error',
        title: 'Disconnection Failed',
        message: 'Failed to disconnect wallet'
      });
    }
  };

  // Get current user from global store
  const { user } = useGlobalStore();
  
  return {
    address: user?.walletAddress || address,
    isConnected: !!user || isConnected,
    isConnecting,
    connect,
    disconnect
  };
};