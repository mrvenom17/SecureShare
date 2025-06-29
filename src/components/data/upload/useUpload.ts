import { useCallback, useState } from 'react';
import { useBlockchain } from '../../../blockchain/hooks/useBlockchain';
import { encryptData, generateHash } from '../../../utils/crypto';
import { validateFile, FileValidationRules } from '../../../utils/fileValidation';

interface UploadStatus {
  fileName: string;
  progress: number;
  status: 'uploading' | 'encrypting' | 'processing' | 'complete' | 'error';
  error?: string;
}

const VALIDATION_RULES: FileValidationRules = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['text/plain', 'application/json', 'application/pdf']
};

export const useUpload = () => {
  const { uploadFile, connected } = useBlockchain();
  const [uploads, setUploads] = useState<Record<string, UploadStatus>>({});

  const updateStatus = (
    fileName: string, 
    update: Partial<UploadStatus>
  ) => {
    setUploads(prev => ({
      ...prev,
      [fileName]: { ...prev[fileName], ...update }
    }));
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    
    for (const file of files) {
      const validation = validateFile(file, VALIDATION_RULES);
      if (!validation.isValid) {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            fileName: file.name,
            progress: 0,
            status: 'error',
            error: validation.error
          }
        }));
        continue;
      }

      setUploads(prev => ({
        ...prev,
        [file.name]: {
          fileName: file.name,
          progress: 0,
          status: 'encrypting'
        }
      }));

      try {
        const content = await readFileContent(file, (progress) => {
          updateStatus(file.name, { progress: progress * 0.3 });
        });

        updateStatus(file.name, { status: 'processing', progress: 30 });
        const hash = generateHash(content);
        const encryptedContent = encryptData(content, 'temp-key');
        
        updateStatus(file.name, { status: 'uploading', progress: 60 });
        await uploadFile(hash, encryptedContent);
        
        updateStatus(file.name, { status: 'complete', progress: 100 });
      } catch (error) {
        updateStatus(file.name, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    }
  }, [connected, uploadFile]);

  return {
    handleDrop,
    isConnected: connected,
    uploads
  };
};

const readFileContent = (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100);
      }
    };
    reader.readAsText(file);
  });
};