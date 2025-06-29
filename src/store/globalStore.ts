import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  lastActive: number;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  ipfsHash: string;
  encryptionKey: string;
  owner: string;
  accessList: string[];
  createdAt: number;
  updatedAt: number;
  tags: string[];
  version: number;
  encrypted: boolean;
  shared: boolean;
  thumbnail?: string;
}

export interface ActivityEvent {
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

interface GlobalState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Files
  files: FileMetadata[];
  uploadProgress: Record<string, number>;
  
  // Activity
  activities: ActivityEvent[];
  
  // UI State
  theme: 'light' | 'dark';
  language: string;
  sidebarOpen: boolean;
  
  // Analytics
  analyticsData: {
    totalFiles: number;
    totalUsers: number;
    storageUsed: number;
    recentActivity: ActivityEvent[];
    fileActivity: any[];
    userActivity: any[];
    securityEvents: any[];
  };
  
  // Actions
  setUser: (user: User | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addFile: (file: FileMetadata) => void;
  updateFile: (id: string, updates: Partial<FileMetadata>) => void;
  removeFile: (id: string) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  addActivity: (activity: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  updateAnalytics: (data: Partial<GlobalState['analyticsData']>) => void;
  refreshAnalytics: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        notifications: [],
        files: [],
        uploadProgress: {},
        activities: [],
        theme: 'light',
        language: 'en',
        sidebarOpen: true,
        analyticsData: {
          totalFiles: 0,
          totalUsers: 0,
          storageUsed: 0,
          recentActivity: [],
          fileActivity: [],
          userActivity: [],
          securityEvents: []
        },

        // Actions
        setUser: (user) => {
          set({ user, isAuthenticated: !!user });
          if (user) {
            get().addActivity({
              type: 'login',
              action: 'User Login',
              user: user.walletAddress,
              ipAddress: '192.168.1.100',
              userAgent: navigator.userAgent,
              location: 'Unknown',
              severity: 'low',
              details: 'User logged in successfully'
            });
          }
        },
        
        addNotification: (notification) => {
          const newNotification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            read: false
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications.slice(0, 49)] // Keep max 50
          }));
        },
        
        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        addFile: (file) => {
          set((state) => ({
            files: [file, ...state.files],
            analyticsData: {
              ...state.analyticsData,
              totalFiles: state.files.length + 1,
              storageUsed: state.analyticsData.storageUsed + file.size
            }
          }));
          
          get().addActivity({
            type: 'file_upload',
            action: 'File Uploaded',
            user: file.owner,
            resource: file.name,
            ipAddress: '192.168.1.100',
            userAgent: navigator.userAgent,
            location: 'Unknown',
            severity: 'low',
            details: `File ${file.name} uploaded successfully`
          });
        },
        
        updateFile: (id, updates) => set((state) => ({
          files: state.files.map(f => 
            f.id === id ? { ...f, ...updates, updatedAt: Date.now() } : f
          )
        })),
        
        removeFile: (id) => {
          const state = get();
          const file = state.files.find(f => f.id === id);
          if (file) {
            set((state) => ({
              files: state.files.filter(f => f.id !== id),
              analyticsData: {
                ...state.analyticsData,
                totalFiles: Math.max(0, state.analyticsData.totalFiles - 1),
                storageUsed: Math.max(0, state.analyticsData.storageUsed - file.size)
              }
            }));
            
            get().addActivity({
              type: 'file_upload',
              action: 'File Deleted',
              user: file.owner,
              resource: file.name,
              ipAddress: '192.168.1.100',
              userAgent: navigator.userAgent,
              location: 'Unknown',
              severity: 'medium',
              details: `File ${file.name} was deleted`
            });
          }
        },
        
        setUploadProgress: (fileId, progress) => set((state) => ({
          uploadProgress: { ...state.uploadProgress, [fileId]: progress }
        })),
        
        addActivity: (activity) => {
          const newActivity = {
            ...activity,
            id: crypto.randomUUID(),
            timestamp: Date.now()
          };
          set((state) => ({
            activities: [newActivity, ...state.activities.slice(0, 99)], // Keep max 100
            analyticsData: {
              ...state.analyticsData,
              recentActivity: [newActivity, ...state.analyticsData.recentActivity.slice(0, 9)]
            }
          }));
        },
        
        setTheme: (theme) => {
          set({ theme });
          document.documentElement.classList.toggle('dark', theme === 'dark');
        },
        
        setLanguage: (language) => set({ language }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        updateAnalytics: (data) => set((state) => ({
          analyticsData: { ...state.analyticsData, ...data }
        })),
        
        refreshAnalytics: () => {
          const state = get();
          const now = Date.now();
          const dayMs = 24 * 60 * 60 * 1000;
          
          // Generate mock file activity data
          const fileActivity = Array.from({ length: 7 }, (_, i) => ({
            name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            uploads: Math.floor(Math.random() * 20) + 5,
            downloads: Math.floor(Math.random() * 50) + 20,
            views: Math.floor(Math.random() * 100) + 50
          }));
          
          // Generate user activity data
          const userActivity = Array.from({ length: 7 }, (_, i) => ({
            time: `${i * 4}:00`,
            active: Math.floor(Math.random() * 80) + 10
          }));
          
          // Generate security events
          const securityEvents = [
            { type: 'Access Granted', count: Math.floor(Math.random() * 200) + 100, severity: 'low' },
            { type: 'Failed Login', count: Math.floor(Math.random() * 50) + 10, severity: 'medium' },
            { type: 'Suspicious Activity', count: Math.floor(Math.random() * 10) + 1, severity: 'high' },
            { type: 'Data Export', count: Math.floor(Math.random() * 30) + 5, severity: 'medium' }
          ];
          
          set((state) => ({
            analyticsData: {
              ...state.analyticsData,
              fileActivity,
              userActivity,
              securityEvents
            }
          }));
        }
      }),
      {
        name: 'secureshare-storage',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarOpen: state.sidebarOpen,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          files: state.files,
          activities: state.activities
        })
      }
    )
  )
);