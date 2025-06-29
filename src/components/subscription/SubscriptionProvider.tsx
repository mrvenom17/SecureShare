import React, { createContext, useContext, useEffect } from 'react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useGlobalStore } from '../../store/globalStore';
import { UsageLimitModal } from './UsageLimitModal';

interface SubscriptionContextType {
  checkAndEnforceLimit: (type: 'storage' | 'files' | 'users' | 'apiCalls', amount?: number) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentSubscription, checkUsageLimits, updateUsage, availableTiers } = useSubscriptionStore();
  const { addNotification } = useGlobalStore();
  const [limitModal, setLimitModal] = React.useState<{
    isOpen: boolean;
    type: 'storage' | 'files' | 'users' | 'apiCalls';
    usage: number;
    limit: number;
  }>({
    isOpen: false,
    type: 'storage',
    usage: 0,
    limit: 0
  });

  const checkAndEnforceLimit = (type: 'storage' | 'files' | 'users' | 'apiCalls', amount = 1): boolean => {
    const limits = checkUsageLimits();
    const currentLimit = limits[type];

    // Check if adding the amount would exceed the limit
    const wouldExceed = (currentLimit.used + amount) > currentLimit.limit;

    if (wouldExceed) {
      setLimitModal({
        isOpen: true,
        type,
        usage: currentLimit.used,
        limit: currentLimit.limit
      });
      
      addNotification({
        type: 'warning',
        title: 'Limit Reached',
        message: `You've reached your ${type} limit. Please upgrade your plan to continue.`
      });
      
      return false;
    }

    // Update usage
    const usageUpdate = {
      [type === 'storage' ? 'storageUsed' : 
       type === 'files' ? 'filesUploaded' :
       type === 'users' ? 'usersAdded' : 'apiCallsUsed']: currentLimit.used + amount
    };
    updateUsage(usageUpdate);

    return true;
  };

  const hasFeatureAccess = (feature: string): boolean => {
    if (!currentSubscription) return false;
    
    const tier = availableTiers.find(t => t.id === currentSubscription.tierId);
    if (!tier) return false;

    switch (feature) {
      case 'analytics':
        return tier.features.analytics;
      case 'customBranding':
        return tier.features.customBranding;
      case 'sso':
        return tier.features.sso;
      case 'compliance':
        return tier.features.compliance;
      case 'layer2':
        return tier.features.layer2;
      case 'zkProofs':
        return tier.features.zkProofs;
      default:
        return true;
    }
  };

  // Monitor usage and show warnings
  useEffect(() => {
    if (!currentSubscription) return;
    
    const limits = checkUsageLimits();
    
    Object.entries(limits).forEach(([type, limit]) => {
      const percentage = (limit.used / limit.limit) * 100;
      
      if (percentage >= 90 && percentage < 100) {
        addNotification({
          type: 'warning',
          title: 'Usage Warning',
          message: `You're approaching your ${type} limit (${percentage.toFixed(0)}% used)`
        });
      }
    });
  }, [currentSubscription?.usage, checkUsageLimits, addNotification]);

  return (
    <SubscriptionContext.Provider value={{ checkAndEnforceLimit, hasFeatureAccess }}>
      {children}
      <UsageLimitModal
        isOpen={limitModal.isOpen}
        onClose={() => setLimitModal(prev => ({ ...prev, isOpen: false }))}
        limitType={limitModal.type}
        currentUsage={limitModal.usage}
        limit={limitModal.limit}
      />
    </SubscriptionContext.Provider>
  );
};