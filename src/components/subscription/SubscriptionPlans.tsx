import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Crown, Zap, Shield, Users, HardDrive, 
  Phone, Mail, MessageCircle, Star, ArrowRight
} from 'lucide-react';
import { useSubscriptionStore, SUBSCRIPTION_TIERS } from '../../store/subscriptionStore';
import { useGlobalStore } from '../../store/globalStore';

export const SubscriptionPlans: React.FC = () => {
  const { 
    currentSubscription, 
    upgradeSubscription, 
    isLoading 
  } = useSubscriptionStore();
  const { theme, addNotification } = useGlobalStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async (tierId: 'free' | 'pro' | 'enterprise') => {
    if (currentSubscription?.tierId === tierId) return;

    const success = await upgradeSubscription(tierId);
    if (success) {
      addNotification({
        type: 'success',
        title: 'Subscription Updated',
        message: `Successfully upgraded to ${SUBSCRIPTION_TIERS.find(t => t.id === tierId)?.name} plan`
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Upgrade Failed',
        message: 'Failed to upgrade subscription. Please try again.'
      });
    }
  };

  const formatPrice = (price: number) => {
    if (billingPeriod === 'yearly') {
      return Math.floor(price * 12 * 0.8); // 20% discount for yearly
    }
    return price;
  };

  const formatStorage = (gb: number) => {
    if (gb >= 1000) return `${gb / 1000}TB`;
    return `${gb}GB`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getPlanIcon = (tierId: string) => {
    switch (tierId) {
      case 'free': return <Shield className="w-8 h-8" />;
      case 'pro': return <Zap className="w-8 h-8" />;
      case 'enterprise': return <Crown className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const getSupportIcon = (support: string) => {
    if (support.includes('Phone')) return <Phone className="w-4 h-4" />;
    if (support.includes('Chat')) return <MessageCircle className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Choose Your Plan
        </h2>
        <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Secure data sharing for individuals, teams, and enterprises
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className={`flex items-center rounded-lg p-1 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              billingPeriod === 'yearly'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              20% off
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrentPlan = currentSubscription?.tierId === tier.id;
          const price = formatPrice(tier.price);
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-2xl border-2 p-8 ${
                tier.popular
                  ? 'border-blue-500 shadow-xl scale-105'
                  : theme === 'dark'
                    ? 'border-gray-700'
                    : 'border-gray-200'
              } ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  tier.id === 'free' ? 'bg-gray-100 text-gray-600' :
                  tier.id === 'pro' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {getPlanIcon(tier.id)}
                </div>
                
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                
                <div className="mt-4">
                  <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ${price}
                  </span>
                  {tier.price > 0 && (
                    <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      /{billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>

                {billingPeriod === 'yearly' && tier.price > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    Save ${tier.price * 12 - price} per year
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Storage
                    </span>
                  </div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatStorage(tier.features.storageLimit)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Users
                    </span>
                  </div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {tier.features.userLimit === 1 ? '1 user' : `Up to ${tier.features.userLimit}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Files
                  </span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(tier.features.fileLimit)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    API Calls
                  </span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(tier.features.apiCalls)}/month
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSupportIcon(tier.features.support)}
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Support
                    </span>
                  </div>
                  <span className={`font-medium text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {tier.features.support}
                  </span>
                </div>

                {/* Feature Checkmarks */}
                <div className="pt-4 space-y-3">
                  {[
                    { key: 'analytics', label: 'Advanced Analytics' },
                    { key: 'customBranding', label: 'Custom Branding' },
                    { key: 'sso', label: 'Single Sign-On' },
                    { key: 'compliance', label: 'Compliance Tools' },
                    { key: 'layer2', label: 'Layer 2 Integration' },
                    { key: 'zkProofs', label: 'Zero-Knowledge Proofs' }
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center space-x-3">
                      {tier.features[feature.key as keyof typeof tier.features] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                      )}
                      <span className={`text-sm ${
                        tier.features[feature.key as keyof typeof tier.features]
                          ? theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(tier.id)}
                disabled={isCurrentPlan || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isCurrentPlan
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isCurrentPlan ? (
                  <span>Current Plan</span>
                ) : (
                  <>
                    <span>{tier.price === 0 ? 'Get Started' : 'Upgrade Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto pt-16">
        <h3 className={`text-2xl font-bold text-center mb-8 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Frequently Asked Questions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              question: "Can I change plans anytime?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
            },
            {
              question: "Is there a free trial?",
              answer: "Yes, all paid plans come with a 14-day free trial. No credit card required."
            },
            {
              question: "What happens to my data if I cancel?",
              answer: "Your data remains accessible for 30 days after cancellation, giving you time to export it."
            }
          ].map((faq, index) => (
            <div key={index} className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {faq.question}
              </h4>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};