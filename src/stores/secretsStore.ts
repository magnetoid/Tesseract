import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWorkspaceStore } from './workspaceStore';

export interface Secret {
  id: string;
  workspaceId: string;
  key: string;
  value: string;
  type: 'app' | 'account';
  inUse: boolean;
  lastUsed?: string;
}

interface SecretsState {
  secrets: Secret[];
  addSecret: (key: string, value: string, workspaceId: string, type?: 'app' | 'account') => void;
  updateSecret: (id: string, updates: Partial<Secret>) => void;
  deleteSecret: (id: string) => void;
  bulkUpdate: (secrets: Secret[]) => void;
  clearWorkspaceSecrets: (workspaceId: string) => void;
}

const MOCK_SECRETS: Secret[] = [
  { id: '1', workspaceId: 'ws-1', key: 'DATABASE_URL', value: 'postgresql://user:password@localhost:5432/mydb', type: 'app', inUse: true },
  { id: '2', workspaceId: 'ws-1', key: 'STRIPE_SECRET_KEY', value: 'sk_test_51MzX...', type: 'app', inUse: true },
  { id: '3', workspaceId: 'ws-1', key: 'JWT_SECRET', value: 'super-secret-token-123', type: 'app', inUse: false },
  { id: '4', workspaceId: 'ws-1', key: 'OPENAI_API_KEY', value: 'sk-proj-abc123xyz', type: 'account', inUse: true },
  { id: '5', workspaceId: 'ws-2', key: 'SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', type: 'app', inUse: true },
];

export const useSecretsStore = create<SecretsState>()(
  persist(
    (set) => ({
      secrets: MOCK_SECRETS,
      addSecret: (key, value, workspaceId, type = 'app') => set((state) => ({
        secrets: [
          ...state.secrets,
          {
            id: Math.random().toString(36).substring(7),
            workspaceId,
            key,
            value,
            type,
            inUse: false,
          }
        ]
      })),
      updateSecret: (id, updates) => set((state) => ({
        secrets: state.secrets.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteSecret: (id) => set((state) => ({
        secrets: state.secrets.filter((s) => s.id !== id)
      })),
      bulkUpdate: (secrets) => set({ secrets }),
      clearWorkspaceSecrets: (workspaceId) => set((state) => ({
        secrets: state.secrets.filter(s => s.workspaceId !== workspaceId)
      })),
    }),
    {
      name: 'tesseract-secrets',
    }
  )
);

// Computed Selectors
export const useActiveSecrets = () => {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const secrets = useSecretsStore((state) => state.secrets);
  return secrets.filter(s => s.workspaceId === activeWorkspaceId);
};
