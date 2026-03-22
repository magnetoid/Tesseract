import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'user' | 'super_admin';
  onboarded: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGitHub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
  setOnboarded: (onboarded: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loginWithGitHub: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser: User = {
          id: 'u_gh_' + Math.random().toString(36).substr(2, 9),
          email: 'dev_user@github.com',
          name: 'GitHub Developer',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=github',
          role: 'user',
          onboarded: true,
          createdAt: new Date().toISOString(),
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      },
      loginWithGoogle: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser: User = {
          id: 'u_go_' + Math.random().toString(36).substr(2, 9),
          email: 'user@google.com',
          name: 'Google User',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
          role: 'user',
          onboarded: true,
          createdAt: new Date().toISOString(),
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      },
      loginWithEmail: async (email: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser: User = {
          id: 'u_em_' + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: email === 'marko.tiosavljevic@gmail.com' ? 'super_admin' : 'user',
          onboarded: true,
          createdAt: new Date().toISOString(),
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      },
      signup: async (name: string, email: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser: User = {
          id: 'u_new_' + Math.random().toString(36).substr(2, 9),
          email,
          name,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: 'user',
          onboarded: false,
          createdAt: new Date().toISOString(),
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      setOnboarded: (onboarded) => set((state) => ({
        user: state.user ? { ...state.user, onboarded } : null
      })),
    }),
    {
      name: 'tesseract-auth',
    }
  )
);
