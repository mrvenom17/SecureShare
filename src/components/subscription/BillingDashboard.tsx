import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Download, Calendar, DollarSign, 
  AlertCircle, CheckCircle, Plus, Trash2, Star,
  FileText, Clock, TrendingUp
} from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useGlobalStore } from '../../store/globalStore';

export const BillingDashboard: React.FC = () => {
  const { 
    currentSubscription, 
    paymentMethods, 
    invoices, 
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    cancelSubscription,
    checkUsageLimits
  } = useSubscriptionStore();
  const { theme, addNotification } = useGlobalStore();
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const usageLimits = checkUsageLimits();

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvc || !newCard.name) {
      addNotification({
        type: 'error',
        title: 'Invalid Card',
        message: 'Please fill in all card details'
      });
      return;
    }

    const paymentMethod = {
      id: crypto.randomUUID(),
      type: 'card' as const,
      last4: newCard.number.slice(-4),
      brand: 'visa',
      expiryMonth: parseInt(newCard.expiry.split('/')[0]),
      expiryYear: parseInt('20' + newCard.expiry.split('/')[1]),
      isDefault: paymentMethods.length === 0
    };

    addPaymentMethod(paymentMethod);
    setNewCard({ number: '', expiry: '', cvc: '', name: '' });
    setShowAddCard(false);
    
    addNotification({
      type: 'success',
      title: 'Card Added',
      message: 'Payment method added successfully'
    });
  };

  const handleCancelSubscription = async () => {
    const success = await cancelSubscription();
    if (success) {
      addNotification({
        type: 'info',
        title: 'Subscription Cancelled',
        message: 'Your subscription will be cancelled at the end of the current period'
      });
    }
  };

  const formatUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Billing & Usage
        </h2>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your subscription, payment methods, and view usage
        </p>
      </div>

      {/* Current Plan */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Current Plan
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentSubscription?.tierId === 'free' ? 'Free Plan' : 
               currentSubscription?.tierId === 'pro' ? 'Professional Plan' : 'Enterprise Plan'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {currentSubscription?.status === 'active' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            <span className={`text-sm font-medium ${
              currentSubscription?.status === 'active' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {currentSubscription?.status}
            </span>
          </div>
        </div>

        {currentSubscription && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Current Period
              </p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} - {' '}
                {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            
            {currentSubscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Subscription will be cancelled on {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Usage Overview */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Usage Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Storage Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Storage
              </span>
              <span className={`text-xs ${
                usageLimits.storage.exceeded ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formatBytes(usageLimits.storage.used)} / {formatBytes(usageLimits.storage.limit)}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full ${
                  usageLimits.storage.exceeded ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${formatUsagePercentage(usageLimits.storage.used, usageLimits.storage.limit)}%` }}
              />
            </div>
          </div>

          {/* Files Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Files
              </span>
              <span className={`text-xs ${
                usageLimits.files.exceeded ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {usageLimits.files.used} / {usageLimits.files.limit}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full ${
                  usageLimits.files.exceeded ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${formatUsagePercentage(usageLimits.files.used, usageLimits.files.limit)}%` }}
              />
            </div>
          </div>

          {/* Users Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Users
              </span>
              <span className={`text-xs ${
                usageLimits.users.exceeded ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {usageLimits.users.used} / {usageLimits.users.limit}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full ${
                  usageLimits.users.exceeded ? 'bg-red-500' : 'bg-purple-500'
                }`}
                style={{ width: `${formatUsagePercentage(usageLimits.users.used, usageLimits.users.limit)}%` }}
              />
            </div>
          </div>

          {/* API Calls Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                API Calls
              </span>
              <span className={`text-xs ${
                usageLimits.apiCalls.exceeded ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {usageLimits.apiCalls.used} / {usageLimits.apiCalls.limit}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className={`h-2 rounded-full ${
                  usageLimits.apiCalls.exceeded ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${formatUsagePercentage(usageLimits.apiCalls.used, usageLimits.apiCalls.limit)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Payment Methods
          </h3>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No payment methods added yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <CreditCard className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        •••• •••• •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {method.brand?.toUpperCase()} • Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      className={`text-sm px-3 py-1 rounded transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => removePaymentMethod(method.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Card Form */}
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-6 p-4 border rounded-lg ${
              theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Add New Card
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  CVC
                </label>
                <input
                  type="text"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                  placeholder="123"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddCard(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Card
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Billing History */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Billing History
        </h3>

        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No invoices yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    invoice.status === 'paid' ? 'bg-green-100' :
                    invoice.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {invoice.status === 'paid' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : invoice.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ${(invoice.amount / 100).toFixed(2)}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      {invoice.paidAt && ` • Paid: ${new Date(invoice.paidAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <button className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Subscription */}
      {currentSubscription?.tierId !== 'free' && !currentSubscription?.cancelAtPeriodEnd && (
        <div className={`rounded-xl border border-red-200 p-6 ${
          theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Cancel Subscription
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Your subscription will remain active until the end of your current billing period.
          </p>
          <button
            onClick={handleCancelSubscription}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
};