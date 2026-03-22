import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'banned';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
  lastLoginAt: number;
}

export interface AuthProvider {
  id: string;
  name: string;
  enabled: boolean;
  config?: Record<string, string>;
}

interface AuthToolState {
  isEnabled: boolean;
  users: AuthUser[];
  providers: {
    email: boolean;
    github: boolean;
    google: boolean;
    magicLink: boolean;
  };
  settings: {
    sessionTimeout: string;
    requireEmailVerification: boolean;
    allowSignUps: boolean;
    redirects: {
      success: string;
      failure: string;
      logout: string;
    };
  };
  branding: {
    logo?: string;
    accentColor: string;
    titleText: string;
  };
  
  // Actions
  enableAuth: () => void;
  toggleProvider: (provider: keyof AuthToolState['providers']) => void;
  updateSettings: (settings: Partial<AuthToolState['settings']>) => void;
  updateBranding: (branding: Partial<AuthToolState['branding']>) => void;
  deleteUser: (id: string) => void;
  banUser: (id: string) => void;
  changeRole: (id: string, role: UserRole) => void;
  inviteUser: (email: string, name: string) => void;
}

const MOCK_USERS: AuthUser[] = [
  {
    id: 'u1',
    email: 'marko.tiosavljevic@gmail.com',
    name: 'Marko Tiosavljevic',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko',
    role: 'admin',
    status: 'active',
    createdAt: Date.now() - 86400000 * 10,
    lastLoginAt: Date.now() - 3600000,
  },
  {
    id: 'u2',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'user',
    status: 'active',
    createdAt: Date.now() - 86400000 * 5,
    lastLoginAt: Date.now() - 86400000,
  },
  {
    id: 'u3',
    email: 'bob.smith@example.com',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'user',
    status: 'banned',
    createdAt: Date.now() - 86400000 * 3,
    lastLoginAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'u4',
    email: 'alice.wonder@example.com',
    name: 'Alice Wonder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    role: 'user',
    status: 'active',
    createdAt: Date.now() - 86400000,
    lastLoginAt: Date.now() - 1800000,
  },
  {
    id: 'u5',
    email: 'charlie.brown@example.com',
    name: 'Charlie Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    role: 'user',
    status: 'active',
    createdAt: Date.now() - 3600000,
    lastLoginAt: Date.now() - 600000,
  }
];

export const useAuthToolStore = create<AuthToolState>()(
  persist(
    (set) => ({
      isEnabled: true, // Mock: enabled by default
      users: MOCK_USERS,
      providers: {
        email: true,
        github: false,
        google: true,
        magicLink: false,
      },
      settings: {
        sessionTimeout: '24hr',
        requireEmailVerification: true,
        allowSignUps: true,
        redirects: {
          success: '/dashboard',
          failure: '/login?error=1',
          logout: '/',
        },
      },
      branding: {
        accentColor: '#7c6ff7',
        titleText: 'Welcome to Torsor',
      },

      enableAuth: () => set({ isEnabled: true }),
      toggleProvider: (provider) => set((state) => ({
        providers: { ...state.providers, [provider]: !state.providers[provider] }
      })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      updateBranding: (newBranding) => set((state) => ({
        branding: { ...state.branding, ...newBranding }
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),
      banUser: (id) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u)
      })),
      changeRole: (id, role) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, role } : u)
      })),
      inviteUser: (email, name) => set((state) => ({
        users: [
          {
            id: `u-${Date.now()}`,
            email,
            name,
            role: 'user',
            status: 'active',
            createdAt: Date.now(),
            lastLoginAt: 0,
          },
          ...state.users
        ]
      })),
    }),
    {
      name: 'torsor-auth-tool',
    }
  )
);
