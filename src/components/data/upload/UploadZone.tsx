import React from 'react';
import { Upload } from 'lucide-react';
import { useUpload } from './useUpload';
import { UploadProgress } from './UploadProgress';

export const UploadZone: React.FC = () => {
  const { handleDrop, isConnected, uploads } = useUpload();

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">
          {isConnected 
            ? 'Drag and drop files here, or click to select' 
            : 'Please connect your wallet to upload files'}
        </p>
      </div>

      {Object.entries(uploads).map(([fileName, status]) => (
        <UploadProgress
          key={fileName}
          fileName={fileName}
          progress={status.progress}
          status={status.status}
          error={status.error}
        />
      ))}
    </div>
  );
};