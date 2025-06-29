export interface SubscriptionTier {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: {
    storageLimit: number; // in GB
    fileLimit: number;
    userLimit: number;
    apiCalls: number;
    support: string;
    analytics: boolean;
    customBranding: boolean;
    sso: boolean;
    compliance: boolean;
    layer2: boolean;
    zkProofs: boolean;
  };
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  usage: {
    storageUsed: number;
    filesUploaded: number;
    apiCallsUsed: number;
    usersAdded: number;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: number;
  paidAt?: number;
  downloadUrl?: string;
}