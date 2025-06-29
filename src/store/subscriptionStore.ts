import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SubscriptionTier, UserSubscription, PaymentMethod, Invoice } from '../types/subscription';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'monthly',
    features: {
      storageLimit: 1, // 1GB
      fileLimit: 100,
      userLimit: 1,
      apiCalls: 1000,
      support: 'Community',
      analytics: false,
      customBranding: false,
      sso: false,
      compliance: false,
      layer2: false,
      zkProofs: false
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    billingPeriod: 'monthly',
    popular: true,
    features: {
      storageLimit: 100, // 100GB
      fileLimit: 10000,
      userLimit: 10,
      apiCalls: 50000,
      support: 'Email & Chat',
      analytics: true,
      customBranding: true,
      sso: false,
      compliance: true,
      layer2: true,
      zkProofs: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    billingPeriod: 'monthly',
    features: {
      storageLimit: 1000, // 1TB
      fileLimit: 100000,
      userLimit: 100,
      apiCalls: 500000,
      support: 'Priority Phone & Email',
      analytics: true,
      customBranding: true,
      sso: true,
      compliance: true,
      layer2: true,
      zkProofs: true
    }
  }
];

interface SubscriptionState {
  currentSubscription: UserSubscription | null;
  availableTiers: SubscriptionTier[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  isLoading: boolean;
  
  // Actions
  setSubscription: (subscription: UserSubscription) => void;
  updateUsage: (usage: Partial<UserSubscription['usage']>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  addInvoice: (invoice: Invoice) => void;
  upgradeSubscription: (tierId: 'free' | 'pro' | 'enterprise') => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  checkUsageLimits: () => {
    storage: { used: number; limit: number; exceeded: boolean };
    files: { used: number; limit: number; exceeded: boolean };
    users: { used: number; limit: number; exceeded: boolean };
    apiCalls: { used: number; limit: number; exceeded: boolean };
  };
}

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    persist(
      (set, get) => ({
        currentSubscription: {
          id: 'default-free',
          userId: 'default-user',
          tierId: 'free',
          status: 'active',
          currentPeriodStart: Date.now(),
          currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
          cancelAtPeriodEnd: false,
          usage: {
            storageUsed: 0,
            filesUploaded: 0,
            apiCallsUsed: 0,
            usersAdded: 1
          }
        },
        availableTiers: SUBSCRIPTION_TIERS,
        paymentMethods: [],
        invoices: [],
        isLoading: false,

        setSubscription: (subscription) => set({ currentSubscription: subscription }),

        updateUsage: (usage) => set((state) => ({
          currentSubscription: state.currentSubscription ? {
            ...state.currentSubscription,
            usage: { ...state.currentSubscription.usage, ...usage }
          } : null
        })),

        addPaymentMethod: (method) => set((state) => ({
          paymentMethods: [...state.paymentMethods, method]
        })),

        removePaymentMethod: (methodId) => set((state) => ({
          paymentMethods: state.paymentMethods.filter(m => m.id !== methodId)
        })),

        setDefaultPaymentMethod: (methodId) => set((state) => ({
          paymentMethods: state.paymentMethods.map(m => ({
            ...m,
            isDefault: m.id === methodId
          }))
        })),

        addInvoice: (invoice) => set((state) => ({
          invoices: [invoice, ...state.invoices]
        })),

        upgradeSubscription: async (tierId) => {
          set({ isLoading: true });
          
          try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
            if (!tier) throw new Error('Invalid tier');

            const newSubscription: UserSubscription = {
              id: crypto.randomUUID(),
              userId: 'current-user',
              tierId,
              status: 'active',
              currentPeriodStart: Date.now(),
              currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
              cancelAtPeriodEnd: false,
              stripeSubscriptionId: `sub_${Math.random().toString(36).substring(2)}`,
              stripeCustomerId: `cus_${Math.random().toString(36).substring(2)}`,
              usage: {
                storageUsed: get().currentSubscription?.usage.storageUsed || 0,
                filesUploaded: get().currentSubscription?.usage.filesUploaded || 0,
                apiCallsUsed: get().currentSubscription?.usage.apiCallsUsed || 0,
                usersAdded: get().currentSubscription?.usage.usersAdded || 1
              }
            };

            // Create invoice
            const invoice: Invoice = {
              id: crypto.randomUUID(),
              subscriptionId: newSubscription.id,
              amount: tier.price * 100, // in cents
              currency: 'usd',
              status: 'paid',
              dueDate: Date.now(),
              paidAt: Date.now(),
              downloadUrl: '#'
            };

            set({ 
              currentSubscription: newSubscription,
              invoices: [invoice, ...get().invoices],
              isLoading: false 
            });

            return true;
          } catch (error) {
            set({ isLoading: false });
            return false;
          }
        },

        cancelSubscription: async () => {
          set({ isLoading: true });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set((state) => ({
              currentSubscription: state.currentSubscription ? {
                ...state.currentSubscription,
                cancelAtPeriodEnd: true
              } : null,
              isLoading: false
            }));

            return true;
          } catch (error) {
            set({ isLoading: false });
            return false;
          }
        },

        checkUsageLimits: () => {
          const subscription = get().currentSubscription;
          if (!subscription) {
            return {
              storage: { used: 0, limit: 0, exceeded: false },
              files: { used: 0, limit: 0, exceeded: false },
              users: { used: 0, limit: 0, exceeded: false },
              apiCalls: { used: 0, limit: 0, exceeded: false }
            };
          }

          const tier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.tierId);
          if (!tier) {
            return {
              storage: { used: 0, limit: 0, exceeded: false },
              files: { used: 0, limit: 0, exceeded: false },
              users: { used: 0, limit: 0, exceeded: false },
              apiCalls: { used: 0, limit: 0, exceeded: false }
            };
          }

          return {
            storage: {
              used: subscription.usage.storageUsed,
              limit: tier.features.storageLimit * 1024 * 1024 * 1024, // Convert GB to bytes
              exceeded: subscription.usage.storageUsed > (tier.features.storageLimit * 1024 * 1024 * 1024)
            },
            files: {
              used: subscription.usage.filesUploaded,
              limit: tier.features.fileLimit,
              exceeded: subscription.usage.filesUploaded >= tier.features.fileLimit
            },
            users: {
              used: subscription.usage.usersAdded,
              limit: tier.features.userLimit,
              exceeded: subscription.usage.usersAdded >= tier.features.userLimit
            },
            apiCalls: {
              used: subscription.usage.apiCallsUsed,
              limit: tier.features.apiCalls,
              exceeded: subscription.usage.apiCallsUsed >= tier.features.apiCalls
            }
          };
        }
      }),
      {
        name: 'subscription-storage',
        partialize: (state) => ({
          currentSubscription: state.currentSubscription,
          paymentMethods: state.paymentMethods,
          invoices: state.invoices
        })
      }
    )
  )
);