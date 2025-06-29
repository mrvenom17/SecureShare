import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, Shield, AlertTriangle, CheckCircle, 
  Download, Calendar, Users, Lock, Eye
} from 'lucide-react';

interface ComplianceReport {
  id: string;
  type: 'GDPR' | 'HIPAA' | 'SOX' | 'ISO27001';
  status: 'compliant' | 'warning' | 'violation';
  lastAudit: number;
  nextAudit: number;
  findings: number;
  score: number;
}

interface AuditTrail {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
}

export const ComplianceCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'audit' | 'policies'>('overview');
  
  const complianceReports: ComplianceReport[] = [
    {
      id: '1',
      type: 'GDPR',
      status: 'compliant',
      lastAudit: Date.now() - 7 * 24 * 60 * 60 * 1000,
      nextAudit: Date.now() + 23 * 24 * 60 * 60 * 1000,
      findings: 0,
      score: 98
    },
    {
      id: '2',
      type: 'HIPAA',
      status: 'compliant',
      lastAudit: Date.now() - 14 * 24 * 60 * 60 * 1000,
      nextAudit: Date.now() + 16 * 24 * 60 * 60 * 1000,
      findings: 1,
      score: 95
    },
    {
      id: '3',
      type: 'SOX',
      status: 'warning',
      lastAudit: Date.now() - 21 * 24 * 60 * 60 * 1000,
      nextAudit: Date.now() + 9 * 24 * 60 * 60 * 1000,
      findings: 3,
      score: 87
    },
    {
      id: '4',
      type: 'ISO27001',
      status: 'compliant',
      lastAudit: Date.now() - 5 * 24 * 60 * 60 * 1000,
      nextAudit: Date.now() + 25 * 24 * 60 * 60 * 1000,
      findings: 0,
      score: 99
    }
  ];

  const auditTrail: AuditTrail[] = [
    {
      id: '1',
      action: 'File Access',
      user: 'john.doe@company.com',
      resource: 'financial_report.pdf',
      timestamp: Date.now() - 30 * 60 * 1000,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      result: 'success'
    },
    {
      id: '2',
      action: 'Permission Grant',
      user: 'admin@company.com',
      resource: 'medical_records.json',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      ipAddress: '10.0.0.50',
      userAgent: 'Chrome/91.0...',
      result: 'success'
    },
    {
      id: '3',
      action: 'Failed Login',
      user: 'unknown@external.com',
      resource: 'system',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      ipAddress: '203.0.113.1',
      userAgent: 'curl/7.68.0',
      result: 'failure'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'violation': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success': return 'text-green-600';
      case 'failure': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Center</h2>
          <p className="text-gray-600 mt-1">Monitor regulatory compliance and audit trails</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'reports', label: 'Compliance Reports', icon: FileCheck },
            { id: 'audit', label: 'Audit Trail', icon: Eye },
            { id: 'policies', label: 'Policies', icon: Lock }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{report.type}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium text-gray-900">{report.score}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      report.score >= 95 ? 'bg-green-500' : 
                      report.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${report.score}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Findings</span>
                  <span className={`font-medium ${report.findings === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {report.findings}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Next audit: {new Date(report.nextAudit).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Compliance Reports</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {complianceReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      report.status === 'compliant' ? 'bg-green-100' :
                      report.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {report.status === 'compliant' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.type} Compliance</h4>
                      <p className="text-sm text-gray-500">
                        Last audit: {new Date(report.lastAudit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{report.score}%</div>
                      <div className="text-sm text-gray-500">{report.findings} findings</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select className="text-sm border-gray-300 rounded-md">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-1 rounded-full ${
                      entry.result === 'success' ? 'bg-green-100' :
                      entry.result === 'failure' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        entry.result === 'success' ? 'bg-green-500' :
                        entry.result === 'failure' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{entry.action}</span>
                        <span className={`text-sm font-medium ${getResultColor(entry.result)}`}>
                          {entry.result}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        User: {entry.user} • Resource: {entry.resource}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        IP: {entry.ipAddress} • {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention Policies</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Financial Records</div>
                  <div className="text-sm text-gray-600">7 years retention</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Medical Data</div>
                  <div className="text-sm text-gray-600">10 years retention</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Personal Data</div>
                  <div className="text-sm text-gray-600">Right to be forgotten</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Policies</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Multi-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Required for all users</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Session Timeout</div>
                  <div className="text-sm text-gray-600">30 minutes inactivity</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">IP Restrictions</div>
                  <div className="text-sm text-gray-600">Corporate networks only</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};