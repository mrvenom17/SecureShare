import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Share2, Copy, Mail, Link, Clock, 
  Users, Shield, Send, Check, AlertCircle
} from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';

interface ShareFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    owner: string;
  } | null;
}

export const ShareFileModal: React.FC<ShareFileModalProps> = ({ isOpen, onClose, file }) => {
  const { theme, addNotification, addActivity, user } = useGlobalStore();
  const [shareMethod, setShareMethod] = useState<'address' | 'link'>('address');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('7d');
  const [permissions, setPermissions] = useState({
    view: true,
    download: true,
    share: false
  });
  const [isSharing, setIsSharing] = useState(false);

  const generateShareLink = () => {
    const link = `https://securevault.pro/share/${crypto.randomUUID()}`;
    setShareLink(link);
    
    addNotification({
      type: 'success',
      title: 'Share Link Generated',
      message: 'Secure share link has been created'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      type: 'success',
      title: 'Copied',
      message: 'Link copied to clipboard'
    });
  };

  const validateAddress = (address: string) => {
    return address.startsWith('0x') && address.length === 42;
  };

  const handleShare = async () => {
    if (!file || !user) return;

    if (shareMethod === 'address') {
      if (!recipientAddress) {
        addNotification({
          type: 'error',
          title: 'Invalid Address',
          message: 'Please enter a valid wallet address'
        });
        return;
      }

      if (!validateAddress(recipientAddress)) {
        addNotification({
          type: 'error',
          title: 'Invalid Address',
          message: 'Please enter a valid Ethereum address'
        });
        return;
      }
    }

    setIsSharing(true);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (shareMethod === 'address') {
        addNotification({
          type: 'success',
          title: 'File Shared',
          message: `${file.name} has been shared with ${recipientAddress.slice(0, 8)}...`
        });

        addActivity({
          type: 'permission_change',
          action: 'File Shared',
          user: user.walletAddress,
          resource: file.name,
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent,
          location: 'Unknown',
          severity: 'medium',
          details: `File shared with ${recipientAddress}`
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Share Link Created',
          message: `Secure share link created for ${file.name}`
        });

        addActivity({
          type: 'permission_change',
          action: 'Share Link Created',
          user: user.walletAddress,
          resource: file.name,
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent,
          location: 'Unknown',
          severity: 'low',
          details: `Share link created with ${linkExpiry} expiry`
        });
      }

      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Share Failed',
        message: 'Failed to share file. Please try again.'
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen || !file) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`max-w-md w-full rounded-xl shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Share2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Share File
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {file.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Share Method Selection */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Share Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShareMethod('address')}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    shareMethod === 'address'
                      ? theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Wallet Address</span>
                </button>
                <button
                  onClick={() => setShareMethod('link')}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    shareMethod === 'link'
                      ? theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Link className="w-4 h-4" />
                  <span className="text-sm">Share Link</span>
                </button>
              </div>
            </div>

            {/* Address Input */}
            {shareMethod === 'address' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                {recipientAddress && !validateAddress(recipientAddress) && (
                  <div className="flex items-center space-x-2 mt-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Invalid Ethereum address</span>
                  </div>
                )}
              </div>
            )}

            {/* Link Generation */}
            {shareMethod === 'link' && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Link Expiry
                  </label>
                  <select
                    value={linkExpiry}
                    onChange={(e) => setLinkExpiry(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {!shareLink ? (
                  <button
                    onClick={generateShareLink}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Link className="w-4 h-4" />
                    <span>Generate Share Link</span>
                  </button>
                ) : (
                  <div className={`p-3 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-mono truncate ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {shareLink}
                      </span>
                      <button
                        onClick={() => copyToClipboard(shareLink)}
                        className={`ml-2 p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Permissions */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Permissions
              </label>
              <div className="space-y-3">
                {[
                  { key: 'view', label: 'View file', description: 'Allow viewing file details' },
                  { key: 'download', label: 'Download file', description: 'Allow downloading the file' },
                  { key: 'share', label: 'Share with others', description: 'Allow sharing with other users' }
                ].map((permission) => (
                  <div key={permission.key} className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {permission.label}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {permission.description}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions[permission.key as keyof typeof permissions]}
                        onChange={(e) => setPermissions({
                          ...permissions,
                          [permission.key]: e.target.checked
                        })}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        permissions[permission.key as keyof typeof permissions]
                          ? 'bg-emerald-600'
                          : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          permissions[permission.key as keyof typeof permissions]
                            ? 'translate-x-5'
                            : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end space-x-3 p-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing || (shareMethod === 'address' && !validateAddress(recipientAddress))}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSharing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSharing ? 'Sharing...' : 'Share File'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};