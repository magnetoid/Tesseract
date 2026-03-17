import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Commit {
  hash: string;
  message: string;
  timestamp: number;
  author: string;
  diff?: { file: string; additions: string[]; deletions: string[] }[];
}

export interface GitState {
  currentBranch: string;
  branches: string[];
  commits: Commit[];
  isGitHubConnected: boolean;
  repoName: string | null;
  autoPush: boolean;
  
  // Actions
  commit: (message: string) => void;
  push: () => Promise<void>;
  switchBranch: (branch: string) => Promise<void>;
  createBranch: (branch: string) => void;
  connectGitHub: (repo: string) => void;
  toggleAutoPush: (enabled: boolean) => void;
  revertToCommit: (hash: string) => void;
}

const INITIAL_COMMITS: Commit[] = [
  {
    hash: 'a1b2c3',
    message: 'Initial commit',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    author: 'Marko Tiosavljevic',
    diff: [
      { file: 'package.json', additions: ['+ "name": "tesseract-app"'], deletions: [] }
    ]
  },
  {
    hash: 'd4e5f6',
    message: 'Add database store and panel',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    author: 'Executor Agent',
    diff: [
      { file: 'src/stores/databaseStore.ts', additions: ['+ export const useDatabaseStore = ...'], deletions: [] }
    ]
  }
];

export const useGitStore = create<GitState>()(
  persist(
    (set, get) => ({
      currentBranch: 'main',
      branches: ['main', 'dev', 'feature/auth'],
      commits: INITIAL_COMMITS,
      isGitHubConnected: false,
      repoName: null,
      autoPush: false,

      commit: (message) => set((state) => ({
        commits: [
          {
            hash: Math.random().toString(16).substring(2, 8),
            message,
            timestamp: Date.now(),
            author: 'Tesseract Agent',
            diff: [{ file: 'various files', additions: ['+ Modified code'], deletions: ['- Old code'] }]
          },
          ...state.commits
        ]
      })),

      push: async () => {
        await new Promise(r => setTimeout(r, 1500));
      },

      switchBranch: async (branch) => {
        await new Promise(r => setTimeout(r, 800));
        set({ currentBranch: branch });
      },

      createBranch: (branch) => set((state) => ({
        branches: [...state.branches, branch],
        currentBranch: branch
      })),

      connectGitHub: (repo) => set({ isGitHubConnected: true, repoName: repo }),
      
      toggleAutoPush: (enabled) => set({ autoPush: enabled }),

      revertToCommit: (hash) => set((state) => {
        const index = state.commits.findIndex(c => c.hash === hash);
        if (index === -1) return state;
        return { commits: state.commits.slice(index) };
      }),
    }),
    {
      name: 'tesseract-git-storage',
    }
  )
);
