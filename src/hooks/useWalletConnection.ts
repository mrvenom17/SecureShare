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
      if (typeof window.ethereum === 'undefined') {
        addNotification({
          type: 'error',
          title: 'MetaMask Not Found',
          message: 'Please install MetaMask to connect your wallet'
        });
        return;
      }

      await connectAsync({ connector: injected() });
      
      addNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: 'Successfully connected to MetaMask'
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      let errorMessage = 'Failed to connect wallet. Please try again.';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      }
      
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: errorMessage
      });
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
      
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

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect
  };
};