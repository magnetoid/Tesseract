import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  workspaceId: string;
  plan: 'free' | 'pro' | 'team';
  tokenBalance?: number;
  tokenLimit?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGitHub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => void;
  upgradePlan: (plan: User['plan']) => void;
  addTokens: (amount: number) => void;
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
          workspaceId: 'w1',
          plan: 'free',
          tokenBalance: 45000,
          tokenLimit: 100000,
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
          workspaceId: 'w1',
          plan: 'free',
          tokenBalance: 45000,
          tokenLimit: 100000,
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
          workspaceId: 'w1',
          plan: 'free',
          tokenBalance: 45000,
          tokenLimit: 100000,
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      upgradePlan: (plan) => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          plan, 
          tokenLimit: plan === 'pro' ? 2000000 : plan === 'team' ? 10000000 : 100000 
        } : null
      })),
      addTokens: (amount) => set((state) => ({
        user: state.user ? { ...state.user, tokenBalance: state.user.tokenBalance + amount } : null
      })),
    }),
    {
      name: 'tesseract-auth',
    }
  )
);
