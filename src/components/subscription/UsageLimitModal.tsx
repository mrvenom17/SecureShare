import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, ArrowRight, Crown } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useGlobalStore } from '../../store/globalStore';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'storage' | 'files' | 'users' | 'apiCalls';
  currentUsage: number;
  limit: number;
}

export const UsageLimitModal: React.FC<UsageLimitModalProps> = ({
  isOpen,
  onClose,
  limitType,
  currentUsage,
  limit
}) => {
  const { upgradeSubscription, currentSubscription } = useSubscriptionStore();
  const { theme, addNotification } = useGlobalStore();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    const targetTier = currentSubscription?.tierId === 'free' ? 'pro' : 'enterprise';
    const success = await upgradeSubscription(targetTier);
    
    if (success) {
      addNotification({
        type: 'success',
        title: 'Subscription Upgraded',
        message: 'Your limits have been increased!'
      });
      onClose();
    } else {
      addNotification({
        type: 'error',
        title: 'Upgrade Failed',
        message: 'Failed to upgrade subscription. Please try again.'
      });
    }
  };

  const getLimitMessage = () => {
    switch (limitType) {
      case 'storage':
        return {
          title: 'Storage Limit Reached',
          message: 'You\'ve reached your storage limit. Upgrade to continue uploading files.',
          icon: '💾'
        };
      case 'files':
        return {
          title: 'File Limit Reached',
          message: 'You\'ve reached your file limit. Upgrade to upload more files.',
          icon: '📁'
        };
      case 'users':
        return {
          title: 'User Limit Reached',
          message: 'You\'ve reached your user limit. Upgrade to add more team members.',
          icon: '👥'
        };
      case 'apiCalls':
        return {
          title: 'API Limit Reached',
          message: 'You\'ve reached your API call limit. Upgrade to continue using the API.',
          icon: '🔌'
        };
      default:
        return {
          title: 'Limit Reached',
          message: 'You\'ve reached your plan limit. Upgrade to continue.',
          icon: '⚠️'
        };
    }
  };

  const limitInfo = getLimitMessage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-md w-full rounded-xl shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{limitInfo.icon}</div>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {limitInfo.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {limitInfo.message}
              </p>
            </div>

            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Current usage: <span className="font-medium">{currentUsage}</span> / <span className="font-medium">{limit}</span>
            </div>
          </div>

          {/* Upgrade Options */}
          <div className="space-y-3">
            {currentSubscription?.tierId === 'free' && (
              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'border-blue-600 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Crown className="w-5 h-5 text-blue-600" />
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Professional Plan
                      </span>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      100GB storage, 10K files, 10 users
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      $29/month
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(currentSubscription?.tierId === 'free' || currentSubscription?.tierId === 'pro') && (
              <div className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'border-purple-600 bg-purple-900/20' : 'border-purple-200 bg-purple-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Crown className="w-5 h-5 text-purple-600" />
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Enterprise Plan
                      </span>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      1TB storage, 100K files, 100 users
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      $99/month
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between p-6 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Maybe Later
          </button>
          
          <button
            onClick={handleUpgrade}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};