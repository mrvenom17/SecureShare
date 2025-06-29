import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { useBlockchain } from '../../blockchain/hooks/useBlockchain';
import { encryptData, generateHash } from '../../utils/crypto';

export const FileUpload: React.FC = () => {
  const { uploadFile, connected } = useBlockchain();

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [connected]);

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const hash = generateHash(content);
        const encryptedContent = encryptData(content, 'temp-key');
        
        try {
          await uploadFile(hash, encryptedContent);
          console.log('File uploaded successfully');
        } catch (error) {
          console.error('Upload failed:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">
        {connected ? 'Drag and drop files here, or' : 'Please connect your wallet to upload files'}
      </p>
      {connected && <Button>Select Files</Button>}
    </div>
  );
};