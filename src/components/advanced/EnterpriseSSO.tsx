import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Settings, CheckCircle, AlertCircle, 
  Key, Globe, Lock, UserCheck, Building
} from 'lucide-react';

interface SSOProvider {
  id: string;
  name: string;
  type: 'SAML' | 'OIDC' | 'LDAP';
  status: 'active' | 'inactive' | 'pending';
  users: number;
  lastSync: number;
  domain: string;
  logo: string;
}

interface SSOConfiguration {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping: Record<string, string>;
  autoProvisioning: boolean;
  defaultRole: string;
}

export const EnterpriseSSO: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'providers' | 'config' | 'users' | 'audit'>('providers');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const ssoProviders: SSOProvider[] = [
    {
      id: '1',
      name: 'Microsoft Azure AD',
      type: 'SAML',
      status: 'active',
      users: 245,
      lastSync: Date.now() - 30 * 60 * 1000,
      domain: 'company.onmicrosoft.com',
      logo: '🔵'
    },
    {
      id: '2',
      name: 'Google Workspace',
      type: 'OIDC',
      status: 'active',
      users: 89,
      lastSync: Date.now() - 15 * 60 * 1000,
      domain: 'company.com',
      logo: '🔴'
    },
    {
      id: '3',
      name: 'Okta',
      type: 'SAML',
      status: 'pending',
      users: 0,
      lastSync: 0,
      domain: 'company.okta.com',
      logo: '🟡'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SAML': return 'text-blue-600 bg-blue-100';
      case 'OIDC': return 'text-green-600 bg-green-100';
      case 'LDAP': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enterprise SSO</h2>
          <p className="text-gray-600 mt-1">Manage single sign-on providers and configurations</p>
        </div>
        <button
          onClick={() => setIsConfiguring(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span>Add Provider</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'providers', label: 'Providers', icon: Building },
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'users', label: 'User Mapping', icon: Users },
            { id: 'audit', label: 'Audit Log', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {ssoProviders.map((provider) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.domain}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(provider.type)}`}>
                    {provider.type}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                    {provider.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Users</span>
                  <span className="font-medium text-gray-900">{provider.users}</span>
                </div>
                
                {provider.lastSync > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sync</span>
                    <span className="text-sm text-gray-900">
                      {new Date(provider.lastSync).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Configure
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Test Connection
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="max-w-4xl space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SAML Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entity ID
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://secureshare.com/saml/metadata"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSO URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://login.microsoftonline.com/..."
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X.509 Certificate
              </label>
              <textarea
                rows={6}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="-----BEGIN CERTIFICATE-----
MIICXjCCAcegAwIBAgIBADANBgkqhkiG9w0BAQ0FADBLMQswCQYDVQQGEwJ1czEL
...
-----END CERTIFICATE-----"
              />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Attribute Mapping</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Attribute
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      defaultValue="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name Attribute
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      defaultValue="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Attribute
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      defaultValue="http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Role
                    </label>
                    <select className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <option>User</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">Auto-provision users</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require signed assertions</span>
              </label>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Test Configuration
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">SSO User Mapping</h3>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                Sync Users
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[
              { name: 'John Doe', email: 'john.doe@company.com', provider: 'Azure AD', role: 'Admin', lastLogin: Date.now() - 2 * 60 * 60 * 1000 },
              { name: 'Jane Smith', email: 'jane.smith@company.com', provider: 'Google', role: 'Manager', lastLogin: Date.now() - 30 * 60 * 1000 },
              { name: 'Bob Johnson', email: 'bob.johnson@company.com', provider: 'Azure AD', role: 'User', lastLogin: Date.now() - 24 * 60 * 60 * 1000 }
            ].map((user, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Provider</div>
                      <div className="font-medium text-gray-900">{user.provider}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Role</div>
                      <div className="font-medium text-gray-900">{user.role}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Last Login</div>
                      <div className="text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">SSO Audit Log</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {[
              { action: 'SSO Login', user: 'john.doe@company.com', provider: 'Azure AD', result: 'success', timestamp: Date.now() - 30 * 60 * 1000 },
              { action: 'User Provisioned', user: 'new.user@company.com', provider: 'Google', result: 'success', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
              { action: 'SSO Login Failed', user: 'invalid@company.com', provider: 'Azure AD', result: 'failure', timestamp: Date.now() - 4 * 60 * 60 * 1000 }
            ].map((event, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      event.result === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {event.result === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{event.action}</div>
                      <div className="text-sm text-gray-500">
                        {event.user} via {event.provider}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-medium ${
                      event.result === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {event.result}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};