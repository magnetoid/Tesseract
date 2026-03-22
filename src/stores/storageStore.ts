import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 'image' | 'video' | 'document' | 'other';

export interface StorageFile {
  id: string;
  name: string;
  type: FileType;
  size: number; // in bytes
  uploadedAt: number;
  url: string;
  path: string; // folder path, e.g., "/" or "/assets"
  thumbnailUrl?: string;
}

export interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface StorageState {
  files: StorageFile[];
  currentPath: string;
  viewMode: 'grid' | 'list';
  totalCapacity: number; // in bytes, e.g., 100MB
  uploads: UploadProgress[];
  
  // Actions
  setPath: (path: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  uploadFile: (file: File) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  clearUploads: () => void;
}

const MOCK_FILES: StorageFile[] = [
  {
    id: '1',
    name: 'logo.png',
    type: 'image',
    size: 245000,
    uploadedAt: Date.now() - 86400000 * 2,
    url: 'https://storage.tesseract.app/project-id/logo.png',
    path: '/',
    thumbnailUrl: 'https://picsum.photos/seed/logo/200/200'
  },
  {
    id: '2',
    name: 'hero-bg.jpg',
    type: 'image',
    size: 1200000,
    uploadedAt: Date.now() - 86400000,
    url: 'https://storage.tesseract.app/project-id/hero-bg.jpg',
    path: '/',
    thumbnailUrl: 'https://picsum.photos/seed/hero/400/300'
  },
  {
    id: '3',
    name: 'data.csv',
    type: 'document',
    size: 45000,
    uploadedAt: Date.now() - 3600000,
    url: 'https://storage.tesseract.app/project-id/data.csv',
    path: '/',
  },
  {
    id: '4',
    name: 'readme.pdf',
    type: 'document',
    size: 890000,
    uploadedAt: Date.now() - 1800000,
    url: 'https://storage.tesseract.app/project-id/readme.pdf',
    path: '/',
  }
];

export const useStorageStore = create<StorageState>()(
  persist(
    (set, get) => ({
      files: MOCK_FILES,
      currentPath: '/',
      viewMode: 'grid',
      totalCapacity: 100 * 1024 * 1024, // 100MB
      uploads: [],

      setPath: (path) => set({ currentPath: path }),
      setViewMode: (mode) => set({ viewMode: mode }),

      uploadFile: (file) => {
        const id = `upload-${Date.now()}`;
        const newUpload: UploadProgress = {
          id,
          name: file.name,
          progress: 0,
          status: 'uploading'
        };

        set((state) => ({ uploads: [newUpload, ...state.uploads] }));

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            const newFile: StorageFile = {
              id: `file-${Date.now()}`,
              name: file.name,
              type: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 
                    file.type.includes('pdf') || file.type.includes('csv') ? 'document' : 'other',
              size: file.size,
              uploadedAt: Date.now(),
              url: `https://storage.tesseract.app/project-id/${file.name}`,
              path: get().currentPath,
              thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
            };

            set((state) => ({
              files: [newFile, ...state.files],
              uploads: state.uploads.map(u => u.id === id ? { ...u, progress: 100, status: 'completed' } : u)
            }));

            // Copy to clipboard automatically as per request
            navigator.clipboard.writeText(newFile.url);
          } else {
            set((state) => ({
              uploads: state.uploads.map(u => u.id === id ? { ...u, progress } : u)
            }));
          }
        }, 400);
      },

      deleteFile: (id) => set((state) => ({
        files: state.files.filter(f => f.id !== id)
      })),

      renameFile: (id, newName) => set((state) => ({
        files: state.files.map(f => f.id === id ? { ...f, name: newName } : f)
      })),

      clearUploads: () => set({ uploads: [] })
    }),
    {
      name: 'tesseract-storage',
      partialize: (state) => ({ files: state.files, viewMode: state.viewMode }),
    }
  )
);
