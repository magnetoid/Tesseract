import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GitFile {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  staged: boolean;
  additions: number;
  deletions: number;
}

export interface Commit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
}

interface GitState {
  currentBranch: string;
  branches: string[];
  ahead: number;
  behind: number;
  changes: GitFile[];
  history: Commit[];
  isGitHubConnected: boolean;
  remoteUrl: string | null;
  autoCommitEnabled: boolean;
  
  // Actions
  switchBranch: (branch: string) => void;
  createBranch: (branch: string) => void;
  toggleStage: (path: string) => void;
  stageAll: () => void;
  unstageAll: () => void;
  commit: (message: string, push?: boolean) => void;
  push: () => void;
  pull: () => void;
  connectGitHub: () => void;
  toggleAutoCommit: () => void;
  revert: (hash: string) => void;
}

const MOCK_CHANGES: GitFile[] = [
  { path: 'src/components/tabs/AuthTab.tsx', status: 'modified', staged: false, additions: 12, deletions: 4 },
  { path: 'src/stores/authStore.ts', status: 'modified', staged: true, additions: 5, deletions: 0 },
  { path: 'src/assets/logo-new.svg', status: 'added', staged: false, additions: 1, deletions: 0 },
  { path: 'src/old-utils.ts', status: 'deleted', staged: true, additions: 0, deletions: 45 },
];

const MOCK_HISTORY: Commit[] = [
  { hash: '7f3a2b1', message: 'feat: implement publishing tab', author: 'Marko Tiosavljevic', timestamp: Date.now() - 3600000 },
  { hash: 'a1b2c3d', message: 'fix: layout responsiveness on mobile', author: 'Marko Tiosavljevic', timestamp: Date.now() - 86400000 },
  { hash: 'e5f6g7h', message: 'chore: update dependencies', author: 'Agent Tesseract', timestamp: Date.now() - 172800000 },
  { hash: 'i9j0k1l', message: 'docs: update readme with setup instructions', author: 'Marko Tiosavljevic', timestamp: Date.now() - 259200000 },
];

export const useGitStore = create<GitState>()(
  persist(
    (set, get) => ({
      currentBranch: 'main',
      branches: ['main', 'feature/auth-tab', 'fix/layout-bug'],
      ahead: 2,
      behind: 0,
      changes: MOCK_CHANGES,
      history: MOCK_HISTORY,
      isGitHubConnected: true,
      remoteUrl: 'https://github.com/marko/torsor-app.git',
      autoCommitEnabled: true,

      switchBranch: (branch) => set({ currentBranch: branch }),
      
      createBranch: (branch) => set((state) => ({ 
        branches: [...state.branches, branch],
        currentBranch: branch 
      })),

      toggleStage: (path) => set((state) => ({
        changes: state.changes.map(f => f.path === path ? { ...f, staged: !f.staged } : f)
      })),

      stageAll: () => set((state) => ({
        changes: state.changes.map(f => ({ ...f, staged: true }))
      })),

      unstageAll: () => set((state) => ({
        changes: state.changes.map(f => ({ ...f, staged: false }))
      })),

      commit: (message, push = false) => {
        const stagedFiles = get().changes.filter(f => f.staged);
        if (stagedFiles.length === 0) return;

        const newCommit: Commit = {
          hash: Math.random().toString(16).substring(2, 9),
          message,
          author: 'Marko Tiosavljevic',
          timestamp: Date.now(),
        };

        set((state) => ({
          history: [newCommit, ...state.history],
          changes: state.changes.filter(f => !f.staged),
          ahead: state.ahead + 1
        }));

        if (push) {
          get().push();
        }
      },

      push: () => {
        // Simulate push
        setTimeout(() => {
          set({ ahead: 0 });
        }, 1000);
      },

      pull: () => {
        // Simulate pull
        setTimeout(() => {
          set({ behind: 0 });
        }, 1000);
      },

      connectGitHub: () => set({ isGitHubConnected: true, remoteUrl: 'https://github.com/marko/torsor-app.git' }),

      toggleAutoCommit: () => set((state) => ({ autoCommitEnabled: !state.autoCommitEnabled })),

      revert: (hash) => {
        set((state) => ({
          history: state.history.filter(c => c.hash !== hash)
        }));
      }
    }),
    {
      name: 'torsor-git-storage',
    }
  )
);
