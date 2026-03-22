import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/workspace';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Mock Super Admin
const MOCK_SUPER_ADMIN: User = {
  id: 'user-1',
  name: 'Marko Tiosavljevic',
  email: 'marko.tiosavljevic@gmail.com',
  avatarUrl: 'https://picsum.photos/seed/marko/200',
  role: 'super_admin',
  createdAt: new Date().toISOString(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: MOCK_SUPER_ADMIN, // Default to super admin for this demo
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'torsor-user-storage',
    }
  )
);
