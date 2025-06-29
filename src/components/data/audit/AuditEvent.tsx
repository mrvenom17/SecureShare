import React from 'react';
import { Clock, User, FileText } from 'lucide-react';

interface AuditEventProps {
  id: string;
  timestamp: number;
  user: string;
  action: string;
  details: string;
}

export const AuditEvent: React.FC<AuditEventProps> = ({
  action,
  user,
  timestamp,
  details
}) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{action}</p>
          <div className="flex items-center gap-2 mt-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{user}</span>
            <Clock className="w-4 h-4 text-gray-400 ml-2" />
            <span className="text-sm text-gray-500">
              {new Date(timestamp).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{details}</p>
        </div>
      </div>
    </div>
  );
};