import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { RoleManager } from './components/rbac/RoleManager';
import { Layer2Integration } from './components/layer2/Layer2Integration';
import { ZKProofSystem } from './components/advanced/ZKProofSystem';
import { ComplianceCenter } from './components/advanced/ComplianceCenter';
import { EnterpriseSSO } from './components/advanced/EnterpriseSSO';
import { APIManagement } from './components/advanced/APIManagement';
import { FileManager } from './components/advanced/FileManager';
import { ActivityLog } from './components/advanced/ActivityLog';
import { SubscriptionPlans } from './components/subscription/SubscriptionPlans';
import { BillingDashboard } from './components/subscription/BillingDashboard';
import { AccountSettings } from './components/subscription/AccountSettings';
import { PWAInstaller } from './components/pwa/PWAInstaller';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { SubscriptionProvider } from './components/subscription/SubscriptionProvider';
import { useGlobalStore } from './store/globalStore';
import { websocketService } from './services/websocket';
import { useAccount } from 'wagmi';

function App() {
  const { sidebarOpen, user, theme, refreshAnalytics } = useGlobalStore();
  const { address, isConnected } = useAccount();
  const [currentView, setCurrentView] = React.useState('dashboard');

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (isConnected && address) {
      websocketService.connect(address);
    }

    return () => {
      websocketService.disconnect();
    };
  }, [isConnected, address]);

  useEffect(() => {
    // Refresh analytics data periodically
    refreshAnalytics();
    const interval = setInterval(refreshAnalytics, 60000); // Every minute
    return () => clearInterval(interval);
  }, [refreshAnalytics]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'roles':
        return <RoleManager />;
      case 'layer2':
        return <Layer2Integration />;
      case 'zkproof':
        return <ZKProofSystem />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'sso':
        return <EnterpriseSSO />;
      case 'api':
        return <APIManagement />;
      case 'files':
        return <FileManager />;
      case 'activity':
        return <ActivityLog />;
      case 'subscription':
        return <SubscriptionPlans />;
      case 'billing':
        return <BillingDashboard />;
      case 'account':
        return <AccountSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SubscriptionProvider>
      <div className={`min-h-screen transition-colors ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Header />
        
        <div className="flex">
          <Sidebar 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-16'
            }`}
          >
            <div className="p-6">
              {renderCurrentView()}
            </div>
          </motion.main>
        </div>

        <PWAInstaller />
        <NotificationCenter />
      </div>
    </SubscriptionProvider>
  );
}

export default App;