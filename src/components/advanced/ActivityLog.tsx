import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Filter, Download, Search, Calendar, 
  User, FileText, Shield, AlertTriangle, CheckCircle,
  Clock, MapPin, Monitor, Smartphone
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'file_upload' | 'file_access' | 'permission_change' | 'login' | 'security_event';
  action: string;
  user: string;
  resource?: string;
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  details: string;
}

export const ActivityLog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('24h');

  const activities: ActivityEvent[] = [
    {
      id: '1',
      type: 'file_upload',
      action: 'File Uploaded',
      user: 'john.doe@company.com',
      resource: 'financial_report_q4.pdf',
      timestamp: Date.now() - 30 * 60 * 1000,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      severity: 'low',
      details: 'Successfully uploaded encrypted file to IPFS'
    },
    {
      id: '2',
      type: 'permission_change',
      action: 'Access Granted',
      user: 'admin@company.com',
      resource: 'medical_records.json',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      ipAddress: '10.0.0.50',
      userAgent: 'Chrome/91.0.4472.124',
      location: 'London, UK',
      severity: 'medium',
      details: 'Granted read access to jane.smith@company.com'
    },
    {
      id: '3',
      type: 'security_event',
      action: 'Failed Login Attempt',
      user: 'unknown@external.com',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      ipAddress: '203.0.113.1',
      userAgent: 'curl/7.68.0',
      location: 'Unknown',
      severity: 'high',
      details: 'Multiple failed authentication attempts detected'
    },
    {
      id: '4',
      type: 'file_access',
      action: 'File Downloaded',
      user: 'jane.smith@company.com',
      resource: 'contract_template.docx',
      timestamp: Date.now() - 6 * 60 * 60 * 1000,
      ipAddress: '192.168.1.105',
      userAgent: 'Safari/14.1.2',
      location: 'San Francisco, US',
      severity: 'low',
      details: 'File accessed and downloaded successfully'
    },
    {
      id: '5',
      type: 'login',
      action: 'SSO Login',
      user: 'bob.johnson@company.com',
      timestamp: Date.now() - 8 * 60 * 60 * 1000,
      ipAddress: '172.16.0.10',
      userAgent: 'Firefox/89.0',
      location: 'Toronto, CA',
      severity: 'low',
      details: 'Successful login via Azure AD SSO'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'file_upload': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'file_access': return <FileText className="w-5 h-5 text-green-600" />;
      case 'permission_change': return <Shield className="w-5 h-5 text-yellow-600" />;
      case 'login': return <User className="w-5 h-5 text-purple-600" />;
      case 'security_event': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="w-4 h-4 text-gray-500" />;
    }
    return <Monitor className="w-4 h-4 text-gray-500" />;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.resource && activity.resource.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
          <p className="text-gray-600 mt-1">Monitor all system activities and security events</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Log</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Activities</option>
              <option value="file_upload">File Uploads</option>
              <option value="file_access">File Access</option>
              <option value="permission_change">Permission Changes</option>
              <option value="login">Login Events</option>
              <option value="security_event">Security Events</option>
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredActivities.length} events found
            </span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                  {getEventIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {activity.action}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}>
                        {activity.severity}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{activity.user}</span>
                    </div>
                    
                    {activity.resource && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">{activity.resource}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{activity.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(activity.userAgent)}
                      <span className="text-sm text-gray-600">{activity.ipAddress}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {activity.details}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      User Agent: {activity.userAgent.substring(0, 50)}...
                    </div>
                    
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredActivities.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or time range.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activities.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Events</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {activities.filter(a => a.type === 'security_event').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">File Operations</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {activities.filter(a => a.type === 'file_upload' || a.type === 'file_access').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Logins</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {activities.filter(a => a.type === 'login').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};