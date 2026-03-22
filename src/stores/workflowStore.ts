import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RunConfig {
  id: string;
  name: string;
  command: string;
  description: string;
  port?: number;
  isRunning: boolean;
}

export interface PortMapping {
  id: string;
  internalPort: number;
  externalUrl: string;
  status: 'active' | 'inactive';
}

export interface WorkflowState {
  configs: RunConfig[];
  nodeVersion: string;
  packageManager: string;
  startupHooks: {
    onStart: string;
    onFileChange: string;
    preDeploy: string;
  };
  ports: PortMapping[];
  
  // Actions
  addConfig: () => void;
  updateConfig: (id: string, updates: Partial<RunConfig>) => void;
  removeConfig: (id: string) => void;
  toggleRun: (id: string) => void;
  setNodeVersion: (version: string) => void;
  setPackageManager: (manager: string) => void;
  updateHook: (hook: keyof WorkflowState['startupHooks'], value: string) => void;
  addPort: (port: number) => void;
  removePort: (id: string) => void;
}

const DEFAULT_CONFIGS: RunConfig[] = [
  {
    id: 'config-1',
    name: 'Dev Server',
    command: 'npm run dev',
    description: 'Start Vite dev server with HMR',
    port: 3000,
    isRunning: true,
  },
  {
    id: 'config-2',
    name: 'Build',
    command: 'npm run build',
    description: 'Compile project for production',
    isRunning: false,
  },
  {
    id: 'config-3',
    name: 'Test',
    command: 'npm test',
    description: 'Run Vitest test suite',
    isRunning: false,
  },
  {
    id: 'config-4',
    name: 'Lint',
    command: 'npm run lint',
    description: 'Check code for style and errors',
    isRunning: false,
  },
];

const DEFAULT_PORTS: PortMapping[] = [
  {
    id: 'port-1',
    internalPort: 3000,
    externalUrl: 'https://torsor-app-3000.preview.torsor.io',
    status: 'active',
  },
];

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      configs: DEFAULT_CONFIGS,
      nodeVersion: '20',
      packageManager: 'npm',
      startupHooks: {
        onStart: 'npm install',
        onFileChange: 'npm run lint',
        preDeploy: 'npm test && npm run build',
      },
      ports: DEFAULT_PORTS,

      addConfig: () => set((state) => ({
        configs: [
          ...state.configs,
          {
            id: `config-${Date.now()}`,
            name: 'New Workflow',
            command: '',
            description: '',
            isRunning: false,
          },
        ],
      })),

      updateConfig: (id, updates) => set((state) => ({
        configs: state.configs.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      })),

      removeConfig: (id) => set((state) => ({
        configs: state.configs.filter((c) => c.id !== id),
      })),

      toggleRun: (id) => set((state) => ({
        configs: state.configs.map((c) => (c.id === id ? { ...c, isRunning: !c.isRunning } : c)),
      })),

      setNodeVersion: (version) => set({ nodeVersion: version }),

      setPackageManager: (manager) => set({ packageManager: manager }),

      updateHook: (hook, value) => set((state) => ({
        startupHooks: { ...state.startupHooks, [hook]: value },
      })),

      addPort: (port) => set((state) => ({
        ports: [
          ...state.ports,
          {
            id: `port-${Date.now()}`,
            internalPort: port,
            externalUrl: `https://torsor-app-${port}.preview.torsor.io`,
            status: 'inactive',
          },
        ],
      })),

      removePort: (id) => set((state) => ({
        ports: state.ports.filter((p) => p.id !== id),
      })),
    }),
    {
      name: 'torsor-workflow-storage',
    }
  )
);
