import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Files, Upload, Download, Share2, Trash2, Eye, 
  Search, Filter, Grid, List, MoreVertical, 
  Lock, Unlock, Clock, User, FileText, Image, Video
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';
import { useSubscription } from '../subscription/SubscriptionProvider';

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

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <Files className="w-5 h-5" />;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || !user) return;

    setIsUploading(true);

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
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
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
          title: 'File Uploaded',
          message: `${file.name} has been uploaded successfully`
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
    event.target.value = ''; // Reset input
  };

  const handleFileAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !user) return;

    switch (action) {
      case 'download':
        // Check API limit for downloads
        if (!checkAndEnforceLimit('apiCalls', 1)) return;
        
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
        updateFile(fileId, { shared: !file.shared });
        addNotification({
          type: 'info',
          title: file.shared ? 'Sharing Disabled' : 'Share Link Created',
          message: file.shared ? `${file.name} is no longer shared` : `Share link created for ${file.name}`
        });
        addActivity({
          type: 'permission_change',
          action: file.shared ? 'Sharing Disabled' : 'File Shared',
          user: user.walletAddress,
          resource: file.name,
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent,
          location: 'Unknown',
          severity: 'medium',
          details: `File ${file.name} sharing ${file.shared ? 'disabled' : 'enabled'}`
        });
        break;
        
      case 'delete':
        removeFile(fileId);
        addNotification({
          type: 'warning',
          title: 'File Deleted',
          message: `${file.name} has been deleted`
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            File Manager
          </h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your secure files and folders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
          </label>
        </div>
      </div>

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
                className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="size">Sort by Size</option>
            </select>
            
            <button className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}>
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
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
                  ? 'bg-blue-100 text-blue-600' 
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
                    {getFileIcon('document')}
                  </div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button className={`p-1 rounded-full shadow-sm ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <MoreVertical className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </button>
                  </div>
                </div>
                
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
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
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
                    onClick={() => handleFileAction('encrypt', file.id)}
                    className={`p-1 transition-colors ${
                      file.encrypted 
                        ? 'text-green-600' 
                        : theme === 'dark' 
                          ? 'text-gray-400 hover:text-green-400' 
                          : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {file.encrypted ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                  <button className={`p-1 transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-green-400' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}>
                    <Eye className="w-3 h-3" />
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
                          {getFileIcon('document')}
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
                
                            ? 'text-gray-400 hover:text-blue-400'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFileAction('share', file.id)}
                        className={`p-1 transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-green-400'
                            : 'text-gray-600 hover:text-green-600'
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
  );
};