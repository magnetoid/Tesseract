import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeployStatus = 'idle' | 'building' | 'deploying' | 'success' | 'error';
export type DeployTarget = 'torsor' | 'vercel' | 'netlify' | 'coolify' | 'gcp' | 'ssh';
export type Environment = 'production' | 'staging' | 'preview';

export interface Deployment {
  id: string;
  target: DeployTarget;
  environment: Environment;
  status: DeployStatus;
  url?: string;
  deployedAt: number;
  duration: string;
  commit: string;
  logs: string[];
}

export interface TargetConfig {
  id: DeployTarget;
  name: string;
  description: string;
  connected: boolean;
  config?: Record<string, string>;
}

interface DeployState {
  currentDeployment: Deployment | null;
  history: Deployment[];
  targets: TargetConfig[];
  settings: {
    environment: Environment;
    buildCommand: string;
    outputDir: string;
    nodeVersion: string;
  };
  customDomains: { domain: string; status: 'pending' | 'active'; ssl: boolean }[];
  isDeploying: boolean;
  
  // Actions
  deploy: (target: DeployTarget) => void;
  unpublish: () => void;
  connectTarget: (target: DeployTarget, config: Record<string, string>) => void;
  updateSettings: (settings: Partial<DeployState['settings']>) => void;
  addDomain: (domain: string) => void;
  rollback: (id: string) => void;
}

const MOCK_HISTORY: Deployment[] = [
  {
    id: 'dep-1',
    target: 'torsor',
    environment: 'production',
    status: 'success',
    url: 'https://torsor-app.torsor.app',
    deployedAt: Date.now() - 86400000,
    duration: '42s',
    commit: 'feat: add auth tab',
    logs: ['[build] starting...', '[build] installing dependencies...', '[build] compiling...', '[deploy] uploading assets...', '[deploy] success!']
  },
  {
    id: 'dep-2',
    target: 'torsor',
    environment: 'production',
    status: 'success',
    url: 'https://torsor-app.torsor.app',
    deployedAt: Date.now() - 86400000 * 2,
    duration: '38s',
    commit: 'fix: layout issues',
    logs: ['[build] starting...', '[deploy] success!']
  }
];

const INITIAL_TARGETS: TargetConfig[] = [
  { id: 'torsor', name: 'Torsor Cloud', description: 'Free hosting on torsor.app', connected: true },
  { id: 'vercel', name: 'Vercel', description: 'Connect your Vercel account', connected: false },
  { id: 'netlify', name: 'Netlify', description: 'Connect your Netlify account', connected: false },
  { id: 'coolify', name: 'Coolify', description: 'Deploy to your own server', connected: false },
  { id: 'gcp', name: 'Google Cloud Run', description: 'Deploy as a container', connected: false },
  { id: 'ssh', name: 'Custom Server (SSH)', description: 'Host + port + SSH key', connected: false },
];

export const useDeployStore = create<DeployState>()(
  persist(
    (set, get) => ({
      currentDeployment: MOCK_HISTORY[0],
      history: MOCK_HISTORY,
      targets: INITIAL_TARGETS,
      settings: {
        environment: 'production',
        buildCommand: 'npm run build',
        outputDir: 'dist',
        nodeVersion: '20.x',
      },
      customDomains: [
        { domain: 'torsor.dev', status: 'active', ssl: true }
      ],
      isDeploying: false,

      deploy: (targetId) => {
        const id = `dep-${Date.now()}`;
        const newDeploy: Deployment = {
          id,
          target: targetId,
          environment: get().settings.environment,
          status: 'building',
          deployedAt: Date.now(),
          duration: '0s',
          commit: 'Manual deployment',
          logs: ['[build] starting build process...']
        };

        set({ isDeploying: true, currentDeployment: newDeploy });

        // Simulate deployment process
        let step = 0;
        const steps = [
          'Installing dependencies...',
          'Running build command: npm run build',
          'Optimizing assets...',
          'Uploading to edge network...',
          'Provisioning SSL certificates...',
          'Finalizing deployment...'
        ];

        const interval = setInterval(() => {
          if (step < steps.length) {
            set((state) => ({
              currentDeployment: state.currentDeployment ? {
                ...state.currentDeployment,
                logs: [...state.currentDeployment.logs, `[${Date.now()}] ${steps[step]}`]
              } : null
            }));
            step++;
          } else {
            clearInterval(interval);
            const finalDeploy: Deployment = {
              ...newDeploy,
              status: 'success',
              url: targetId === 'torsor' ? 'https://torsor-app.torsor.app' : 'https://custom-deploy.vercel.app',
              duration: '45s',
              logs: [...(get().currentDeployment?.logs || []), '[deploy] Deployment successful!']
            };
            set({ 
              isDeploying: false, 
              currentDeployment: finalDeploy,
              history: [finalDeploy, ...get().history]
            });
          }
        }, 1500);
      },

      unpublish: () => set({ currentDeployment: null }),

      connectTarget: (targetId, config) => set((state) => ({
        targets: state.targets.map(t => t.id === targetId ? { ...t, connected: true, config } : t)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      addDomain: (domain) => set((state) => ({
        customDomains: [...state.customDomains, { domain, status: 'pending', ssl: false }]
      })),

      rollback: (id) => {
        const deploy = get().history.find(d => d.id === id);
        if (deploy) {
          set({ currentDeployment: deploy });
        }
      }
    }),
    {
      name: 'torsor-deploy-storage',
    }
  )
);
