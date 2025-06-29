import React from 'react';
import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: 'uploading' | 'encrypting' | 'processing' | 'complete' | 'error';
  error?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status,
  error
}) => {
  const statusMessages = {
    uploading: 'Uploading...',
    encrypting: 'Encrypting...',
    processing: 'Processing...',
    complete: 'Complete',
    error: error || 'Upload failed'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium truncate">{fileName}</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            status === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        {status !== 'complete' && status !== 'error' && (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        )}
        <span className={`text-sm ${
          status === 'error' ? 'text-red-500' : 'text-gray-600'
        }`}>
          {statusMessages[status]}
        </span>
      </div>
    </div>
  );
};