import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Users, Shield, Activity, TrendingUp, 
  Files, HardDrive, Zap, Crown, AlertTriangle
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useSubscription } from '../subscription/SubscriptionProvider';

export const Dashboard: React.FC = () => {
  const { files, activities, theme, user } = useGlobalStore();
  const { currentSubscription, checkUsageLimits } = useSubscriptionStore();
  const { hasFeatureAccess } = useSubscription();
  
  const usageLimits = checkUsageLimits();
  
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const formatUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const recentFiles = files.slice(0, 5);
  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome back{user ? `, ${user.walletAddress.slice(0, 8)}...` : ''}!
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's what's happening with your secure data platform
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {currentSubscription?.tierId === 'free' ? 'Free Plan' :
               currentSubscription?.tierId === 'pro' ? 'Professional' : 'Enterprise'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Files
              </p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {files.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Files className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl border p-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Storage Used
              </p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatBytes(usageLimits.storage.used)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl border p-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Users
              </p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {usageLimits.users.used}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl border p-6 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                API Calls
              </p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {usageLimits.apiCalls.used}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
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

      {/* Recent Files and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className={`rounded-xl border p-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Recent Files
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          {recentFiles.length === 0 ? (
            <div className="text-center py-8">
              <Files className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No files uploaded yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div key={file.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <Files className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {file.encrypted && (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className={`rounded-xl border p-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className={`p-1 rounded-full ${
                    activity.severity === 'high' ? 'bg-red-100' :
                    activity.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.severity === 'high' ? 'bg-red-500' :
                      activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {activity.action}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.details}
                    </p>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feature Access Notice */}
      {!hasFeatureAccess('analytics') && (
        <div className={`rounded-xl border border-yellow-200 p-6 ${
          theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
        }`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Unlock Advanced Features
              </h3>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Upgrade to Professional or Enterprise to access advanced analytics, compliance tools, and more.
              </p>
            </div>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};