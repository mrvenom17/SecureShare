import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, DollarSign, Clock, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';

interface Layer2Network {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  gasPrice: string;
  avgConfirmTime: string;
  logo: string;
  color: string;
}

const LAYER2_NETWORKS: Layer2Network[] = [
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    gasPrice: '0.1 gwei',
    avgConfirmTime: '1-2 seconds',
    logo: '🔵',
    color: 'bg-blue-500'
  },
  {
    id: 'optimism',
    name: 'Optimism',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    gasPrice: '0.001 gwei',
    avgConfirmTime: '1-3 seconds',
    logo: '🔴',
    color: 'bg-red-500'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    gasPrice: '30 gwei',
    avgConfirmTime: '2-3 seconds',
    logo: '🟣',
    color: 'bg-purple-500'
  }
];

export const Layer2Integration: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState<Layer2Network>(LAYER2_NETWORKS[0]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'File Upload',
      hash: '0x1234...5678',
      status: 'confirmed',
      gasUsed: '0.001 ETH',
      timestamp: Date.now() - 300000
    },
    {
      id: '2',
      type: 'Access Grant',
      hash: '0x5678...9012',
      status: 'pending',
      gasUsed: '0.0005 ETH',
      timestamp: Date.now() - 60000
    }
  ]);

  const handleNetworkSwitch = async (network: Layer2Network) => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, you would use wagmi's switchNetwork
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network switch
      setSelectedNetwork(network);
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const calculateSavings = () => {
    const mainnetGas = 50; // gwei
    const l2Gas = parseFloat(selectedNetwork.gasPrice);
    const savings = ((mainnetGas - l2Gas) / mainnetGas * 100).toFixed(1);
    return savings;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Layer 2 Integration</h2>
          <p className="text-gray-600 mt-1">Reduce gas fees with Layer 2 scaling solutions</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Network Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Layer 2 Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LAYER2_NETWORKS.map((network) => (
            <motion.div
              key={network.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedNetwork.id === network.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleNetworkSwitch(network)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{network.logo}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{network.name}</h4>
                    <p className="text-sm text-gray-500">Chain ID: {network.chainId}</p>
                  </div>
                </div>
                {selectedNetwork.id === network.id && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gas Price:</span>
                  <span className="font-medium text-green-600">{network.gasPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confirm Time:</span>
                  <span className="font-medium">{network.avgConfirmTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gas Savings Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gas Savings</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{calculateSavings()}%</p>
              <p className="text-sm text-gray-500 mt-1">vs Ethereum Mainnet</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Transaction Cost</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">$0.05</p>
              <p className="text-sm text-gray-500 mt-1">on {selectedNetwork.name}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmation Time</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">1.5s</p>
              <p className="text-sm text-gray-500 mt-1">average</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    tx.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {tx.status === 'confirmed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.type}</p>
                    <p className="text-sm text-gray-500">{tx.hash}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{tx.gasUsed}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Network</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium">{selectedNetwork.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Chain ID:</span>
                <span className="text-sm font-medium">{selectedNetwork.chainId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">TPS:</span>
                <span className="text-sm font-medium">4,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Block Time:</span>
                <span className="text-sm font-medium">2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime:</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};