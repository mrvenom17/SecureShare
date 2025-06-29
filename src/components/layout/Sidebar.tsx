import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, Users, Settings, Zap,
  Shield, Files, Activity, Globe, ChevronLeft, ChevronRight,
  Key, FileCheck, Building, Code, CreditCard, User, Crown
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'files', label: 'File Manager', icon: Files },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'roles', label: 'Role Management', icon: Users },
  { id: 'layer2', label: 'Layer 2', icon: Zap },
  { id: 'zkproof', label: 'ZK Proofs', icon: Shield },
  { id: 'compliance', label: 'Compliance', icon: FileCheck },
  { id: 'sso', label: 'Enterprise SSO', icon: Building },
  { id: 'api', label: 'API Management', icon: Code },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { 
    id: 'subscription', 
    label: 'Subscription', 
    icon: Crown, 
    section: 'account',
    children: [
      { id: 'subscription', label: 'Plans & Pricing', icon: Crown },
      { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
      { id: 'account', label: 'Account Settings', icon: User }
    ]
  },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { sidebarOpen, toggleSidebar, theme } = useGlobalStore();

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r z-30 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-6 border rounded-full p-1 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-600 hover:bg-gray-800'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto h-full">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.children && item.children.some(child => child.id === currentView));
          
          return (
            <div key={item.id}>
              <motion.button
                onClick={() => onViewChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-blue-900 text-blue-300 border border-blue-700'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </motion.button>
              
              {/* Sub-menu for subscription */}
              {item.children && sidebarOpen && isActive && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = currentView === child.id;
                    
                    return (
                      <button
                        key={child.id}
                        onClick={() => onViewChange(child.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isChildActive
                            ? theme === 'dark'
                              ? 'bg-blue-800 text-blue-200'
                              : 'bg-blue-100 text-blue-700'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        <ChildIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">SecureShare Elite</span>
            </div>
            <p className="text-xs opacity-90">
              Enterprise-grade secure data sharing platform
            </p>
          </div>
        </div>
      )}
    </motion.aside>
  );
};