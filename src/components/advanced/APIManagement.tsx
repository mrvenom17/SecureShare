import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Key, Globe, Activity, Copy, Eye, EyeOff, 
  Plus, Trash2, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: number;
  requests: number;
  rateLimit: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: number;
  expiresAt: number;
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authentication: boolean;
  rateLimit: string;
  status: 'active' | 'deprecated';
}

export const APIManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'keys' | 'endpoints' | 'docs' | 'analytics'>('keys');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const { addNotification } = useGlobalStore();

  const apiKeys: APIKey[] = [
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_51H7...',
      permissions: ['files:read', 'files:write', 'users:read'],
      lastUsed: Date.now() - 2 * 60 * 60 * 1000,
      requests: 15420,
      rateLimit: 1000,
      status: 'active',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_4eC3...',
      permissions: ['files:read', 'analytics:read'],
      lastUsed: Date.now() - 30 * 60 * 1000,
      requests: 2341,
      rateLimit: 100,
      status: 'active',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000
    }
  ];

  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/files',
      description: 'List all accessible files',
      authentication: true,
      rateLimit: '100/hour',
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/v1/files',
      description: 'Upload a new file',
      authentication: true,
      rateLimit: '50/hour',
      status: 'active'
    },
    {
      method: 'GET',
      path: '/api/v1/files/{id}',
      description: 'Get file details',
      authentication: true,
      rateLimit: '200/hour',
      status: 'active'
    },
    {
      method: 'POST',
      path: '/api/v1/files/{id}/access',
      description: 'Grant file access',
      authentication: true,
      rateLimit: '20/hour',
      status: 'active'
    },
    {
      method: 'DELETE',
      path: '/api/v1/files/{id}/access',
      description: 'Revoke file access',
      authentication: true,
      rateLimit: '20/hour',
      status: 'active'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      type: 'success',
      title: 'Copied',
      message: 'API key copied to clipboard'
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const revokeKey = (keyId: string) => {
    addNotification({
      type: 'warning',
      title: 'API Key Revoked',
      message: 'The API key has been permanently revoked'
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Management</h2>
          <p className="text-gray-600 mt-1">Manage API keys, endpoints, and documentation</p>
        </div>
        <button
          onClick={() => setIsCreatingKey(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create API Key</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'endpoints', label: 'Endpoints', icon: Globe },
            { id: 'docs', label: 'Documentation', icon: Code },
            { id: 'analytics', label: 'Analytics', icon: Activity }
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

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {apiKeys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apiKey.status === 'active' ? 'bg-green-100 text-green-800' :
                    apiKey.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {apiKey.status}
                  </span>
                  
                  <button
                    onClick={() => revokeKey(apiKey.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Requests</div>
                  <div className="font-medium text-gray-900">{apiKey.requests.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Rate Limit</div>
                  <div className="font-medium text-gray-900">{apiKey.rateLimit}/hour</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Last Used</div>
                  <div className="font-medium text-gray-900">
                    {new Date(apiKey.lastUsed).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expires</div>
                  <div className="font-medium text-gray-900">
                    {new Date(apiKey.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-2">API Key</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm">
                      {showKey[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      {showKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Permissions</div>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">API Endpoints</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <div>
                      <code className="font-mono text-sm text-gray-900">{endpoint.path}</code>
                      <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Rate Limit</div>
                      <div className="font-medium text-gray-900">{endpoint.rateLimit}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {endpoint.authentication && (
                        <Key className="w-4 h-4 text-yellow-600" title="Authentication required" />
                      )}
                      <span className={`w-2 h-2 rounded-full ${
                        endpoint.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">API Documentation</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Authentication</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  Include your API key in the Authorization header:
                </p>
                <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Example Request</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm whitespace-pre">
{`curl -X GET "https://api.secureshare.com/v1/files" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Response Format</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm whitespace-pre">
{`{
  "data": [
    {
      "id": "file_123",
      "name": "document.pdf",
      "size": 1024000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}`}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">17,761</p>
                <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Keys</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                <p className="text-sm text-gray-500 mt-1">2 created this month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Key className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0.3%</p>
                <p className="text-sm text-red-600 mt-1">+0.1% from last week</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};