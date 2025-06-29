import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Files, Upload, Download, Share2, Trash2, Eye, 
  Search, Filter, Grid, List, MoreVertical, 
  Lock, Unlock, Clock, User, FileText, Image, Video,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';
import { useSubscription } from '../subscription/SubscriptionProvider';
import { ShareFileModal } from './ShareFileModal';

export const FileManager: React.FC = () => {
  const { 
    files, 
    addFile, 
    removeFile, 
    updateFile, 
    addNotification, 
    addActivity,
    theme,
    user 
  } = useGlobalStore();
  
  const { checkAndEnforceLimit } = useSubscription();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    file: { id: string; name: string; owner: string } | null;
  }>({
    isOpen: false,
    file: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const simulateFileUpload = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
          resolve();
        }
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
      }, 200);
    });
  };

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || !user) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Please connect your wallet first'
      });
      return;
    }

    setIsUploading(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check file limit before uploading
      if (!checkAndEnforceLimit('files', 1)) {
        setIsUploading(false);
        return;
      }
      
      // Check storage limit before uploading
      if (!checkAndEnforceLimit('storage', file.size)) {
        setIsUploading(false);
        return;
      }
      
      try {
        // Start upload progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Simulate file processing and encryption
        await simulateFileUpload(file);
        
        const newFile = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          mimeType: file.type,
          ipfsHash: `Qm${Math.random().toString(36).substring(2, 15)}`,
          encryptionKey: crypto.randomUUID(),
          owner: user.walletAddress,
          accessList: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: [],
          version: 1,
          encrypted: true,
          shared: false,
          thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        };

        addFile(newFile);
        
        addNotification({
          type: 'success',
          title: 'File Uploaded Successfully',
          message: `${file.name} has been encrypted and uploaded`
        });

        addActivity({
          type: 'file_upload',
          action: 'File Uploaded',
          user: user.walletAddress,
          resource: file.name,
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent,
          location: 'Unknown',
          severity: 'low',
          details: `File ${file.name} uploaded and encrypted`
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: `Failed to upload ${file.name}`
        });
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !user) return;

    switch (action) {
      case 'download':
        // Check API limit for downloads
        if (!checkAndEnforceLimit('apiCalls', 1)) return;
        
        // Create a download link
        const element = document.createElement('a');
        const fileContent = `File: ${file.name}\nSize: ${formatFileSize(file.size)}\nUploaded: ${new Date(file.createdAt).toLocaleString()}\nIPFS Hash: ${file.ipfsHash}`;
        const fileBlob = new Blob([fileContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(fileBlob);
        element.download = file.name;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        addNotification({
          type: 'success',
          title: 'Download Started',
          message: `Downloading ${file.name}`
        });
        
        addActivity({
          type: 'file_access',
          action: 'File Downloaded',
          user: user.walletAddress,
          resource: file.name,
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent,
          location: 'Unknown',
          severity: 'low',
          details: `File ${file.name} was downloaded`
        });
        break;
        
      case 'share':
        setShareModal({
          isOpen: true,
          file: {
            id: file.id,
            name: file.name,
            owner: file.owner
          }
        });
        break;
        
      case 'delete':
        removeFile(fileId);
        addNotification({
          type: 'warning',
          title: 'File Deleted',
          message: `${file.name} has been permanently deleted`
        });
        
        addActivity({
          type: 'file_upload',
          action: 'File Deleted',
          user: user.walletAddress,
          resource: file.name,
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent,
          location: 'Unknown',
          severity: 'medium',
          details: `File ${file.name} was deleted`
        });
        break;
        
      case 'encrypt':
        updateFile(fileId, { encrypted: !file.encrypted });
        addNotification({
          type: 'success',
          title: file.encrypted ? 'File Decrypted' : 'File Encrypted',
          message: `${file.name} has been ${file.encrypted ? 'decrypted' : 'encrypted'}`
        });
        break;
    }
  };

  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.createdAt - a.createdAt;
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              File Manager
            </h2>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your secure encrypted files
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              disabled={isUploading || !user}
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                isUploading || !user
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white`}
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
            </label>
          </div>
        </div>

        {/* Connection Status */}
        {!user && (
          <div className={`rounded-xl border p-4 ${
            theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Wallet Not Connected
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Please connect your wallet to upload and manage files.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className={`rounded-xl border p-4 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Upload Progress
            </h3>
            <div className="space-y-3">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {fileName}
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className={`rounded-xl shadow-sm border p-4 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        {user && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 hover:border-emerald-500 bg-gray-800/50'
                : 'border-gray-300 hover:border-emerald-500 bg-gray-50'
            }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <p className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Drop files here to upload
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Or click the upload button above
            </p>
          </div>
        )}

        {/* File Grid/List */}
        {filteredFiles.length === 0 ? (
          <div className={`rounded-xl shadow-sm border p-12 text-center ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <Files className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No files found
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'Try adjusting your search criteria.' : 'Upload your first file to get started.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl shadow-sm border p-4 transition-shadow group hover:shadow-md ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="relative">
                  {file.thumbnail ? (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className={`w-full h-32 rounded-lg mb-3 flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {getFileIcon(file.mimeType)}
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {file.encrypted && (
                      <div className="p-1 bg-green-100 rounded-full">
                        <Lock className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                    {file.shared && (
                      <div className="p-1 bg-blue-100 rounded-full">
                        <Share2 className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`font-medium truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} title={file.name}>
                    {file.name}
                  </h3>
                  
                  <div className={`flex items-center justify-between text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>{formatFileSize(file.size)}</span>
                    <span>v{file.version}</span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <User className="w-3 h-3" />
                    <span className="truncate">{file.owner.slice(0, 8)}...</span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className={`mt-4 pt-4 border-t flex items-center justify-between ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => handleFileAction('download', file.id)}
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFileAction('share', file.id)}
                      className={`p-1 transition-colors ${
                        file.shared 
                          ? 'text-blue-600' 
                          : theme === 'dark' 
                            ? 'text-gray-400 hover:text-blue-400' 
                            : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFileAction('delete', file.id)}
                      className={`p-1 transition-colors ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-red-400' 
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl shadow-sm border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                <div className={`col-span-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Name
                </div>
                <div className={`col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Size
                </div>
                <div className={`col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Owner
                </div>
                <div className={`col-span-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Modified
                </div>
                <div className={`col-span-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Actions
                </div>
              </div>
            </div>
            
            <div className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 group transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {file.thumbnail ? (
                          <img
                            src={file.thumbnail}
                            alt={file.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            {getFileIcon(file.mimeType)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium truncate ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {file.name}
                          </span>
                          {file.encrypted && <Lock className="w-3 h-3 text-green-600" />}
                          {file.shared && <Share2 className="w-3 h-3 text-blue-600" />}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`col-span-2 text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formatFileSize(file.size)}
                    </div>
                    
                    <div className={`col-span-2 text-sm truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {file.owner.slice(0, 8)}...
                    </div>
                    
                    <div className={`col-span-2 text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {new Date(file.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="col-span-1">
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleFileAction('download', file.id)}
                          className={`p-1 transition-colors ${
                            theme === 'dark' 
                              ? 'text-gray-400 hover:text-emerald-400'
                              : 'text-gray-600 hover:text-emerald-600'
                          }`}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFileAction('share', file.id)}
                          className={`p-1 transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-blue-400'
                              : 'text-gray-600 hover:text-blue-600'
                          }`}
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFileAction('delete', file.id)}
                          className={`p-1 transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-red-400'
                              : 'text-gray-600 hover:text-red-600'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareFileModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, file: null })}
        file={shareModal.file}
      />
    </>
  );
};