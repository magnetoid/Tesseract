import { create } from 'zustand';

export type ContextType = 'file' | 'code' | 'canvas';

export interface ContextItem {
  id: string;
  type: ContextType;
  name: string;
  content?: string;
}

export type MessageType = 'user' | 'agent' | 'work' | 'plan' | 'terminal' | 'error' | 'deploy';

export interface ChatMessageData {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
  metadata?: any;
}

interface ChatState {
  messages: ChatMessageData[];
  isAgentWorking: boolean;
  currentThread: { id: string; title: string } | null;
  selectedContext: ContextItem[];
  planning: boolean;
  
  // Actions
  sendMessage: (content: string) => void;
  clearChat: () => void;
  addContext: (item: ContextItem) => void;
  removeContext: (id: string) => void;
  setThread: (thread: { id: string; title: string } | null) => void;
  setPlanning: (planning: boolean) => void;
  setAgentWorking: (working: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isAgentWorking: false,
  currentThread: null,
  selectedContext: [],
  planning: false,

  reset: () => set({
    messages: [],
    isAgentWorking: false,
    currentThread: null,
    selectedContext: [],
    planning: false,
  }),

  sendMessage: (content) => {
    const newMessage: ChatMessageData = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      isAgentWorking: true,
      currentThread: state.currentThread || { id: `thread-${Date.now()}`, title: content.slice(0, 50) },
    }));

    // Simulate agent response
    setTimeout(() => {
      const agentMsg: ChatMessageData = {
        id: `msg-agent-${Date.now()}`,
        type: 'agent',
        content: "I'm working on that for you. I'll start by analyzing the project structure.",
        timestamp: Date.now(),
      };
      set((state) => ({ messages: [...state.messages, agentMsg] }));
      
      // Simulate work indicator
      setTimeout(() => {
        const workMsg: ChatMessageData = {
          id: `msg-work-${Date.now()}`,
          type: 'work',
          content: "Analyzing project structure...",
          timestamp: Date.now(),
          metadata: { status: 'running' }
        };
        set((state) => ({ messages: [...state.messages, workMsg] }));
        
        setTimeout(() => {
          set({ isAgentWorking: false });
          
          // Mock Secret Scanner trigger
          if (content.toLowerCase().includes('auth') || content.toLowerCase().includes('login')) {
            setTimeout(() => {
              const scannerMsg: ChatMessageData = {
                id: `msg-scanner-${Date.now()}`,
                type: 'agent',
                content: "I found what looks like an API key in auth.ts:12. Move it to Secrets?",
                timestamp: Date.now(),
                metadata: {
                  action: 'move_to_secrets',
                  key: 'STRIPE_SECRET_KEY',
                  file: 'auth.ts',
                  line: 12
                }
              };
              set((state) => ({ messages: [...state.messages, scannerMsg] }));
            }, 1000);
          }

          // Mock Storage trigger
          if (content.toLowerCase().includes('upload') || content.toLowerCase().includes('image')) {
            setTimeout(() => {
              const storageMsg: ChatMessageData = {
                id: `msg-storage-${Date.now()}`,
                type: 'agent',
                content: "I'll save the uploaded image to App Storage. You can access it in your code using storage.get('filename.png').",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'storage'
                }
              };
              set((state) => ({ messages: [...state.messages, storageMsg] }));
            }, 1500);
          }

          // Mock Auth trigger
          if (content.toLowerCase().includes('login') || content.toLowerCase().includes('auth')) {
            setTimeout(() => {
              const authMsg: ChatMessageData = {
                id: `msg-auth-${Date.now()}`,
                type: 'agent',
                content: "Auth enabled! I've scaffolded the login page, user management, and session handling. Users can now sign in with email and Google.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'auth'
                }
              };
              set((state) => ({ messages: [...state.messages, authMsg] }));
            }, 2000);
          }

          // Mock Publishing trigger
          if (content.toLowerCase().includes('deploy') || content.toLowerCase().includes('publish')) {
            setTimeout(() => {
              const deployMsg: ChatMessageData = {
                id: `msg-deploy-${Date.now()}`,
                type: 'agent',
                content: "I've prepared your project for deployment. You can now publish it to Tesseract Cloud, Vercel, or your own server via SSH. I've also auto-detected your build command as 'npm run build'.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'publishing'
                }
              };
              set((state) => ({ messages: [...state.messages, deployMsg] }));
            }, 2500);
          }

          // Mock Validation trigger
          if (content.toLowerCase().includes('test') || content.toLowerCase().includes('validate')) {
            setTimeout(() => {
              const testMsg: ChatMessageData = {
                id: `msg-test-${Date.now()}`,
                type: 'agent',
                content: "I've analyzed your project and detected Vitest as the test framework. I've also generated a set of tests for your auth logic. You can run them in the Validation tab.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'validation'
                }
              };
              set((state) => ({ messages: [...state.messages, testMsg] }));
            }, 3000);
          }

          // Mock Git trigger
          if (content.toLowerCase().includes('git') || content.toLowerCase().includes('commit') || content.toLowerCase().includes('branch')) {
            setTimeout(() => {
              const gitMsg: ChatMessageData = {
                id: `msg-git-${Date.now()}`,
                type: 'agent',
                content: "I've initialized a Git repository for your project. You can manage branches, stage changes, and commit directly from the Git tab. I'll also auto-commit your changes after each plan completion.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'git'
                }
              };
              set((state) => ({ messages: [...state.messages, gitMsg] }));
            }, 3500);
          }

          // Mock Workflows trigger
          if (content.toLowerCase().includes('workflow') || content.toLowerCase().includes('run') || content.toLowerCase().includes('port')) {
            setTimeout(() => {
              const workflowMsg: ChatMessageData = {
                id: `msg-workflow-${Date.now()}`,
                type: 'agent',
                content: "I've detected your project's run configurations from package.json. You can manage your dev server, build scripts, and port mappings in the Workflows tab.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'workflow'
                }
              };
              set((state) => ({ messages: [...state.messages, workflowMsg] }));
            }, 4000);
          }

          // Mock Canvas trigger
          if (content.toLowerCase().includes('canvas') || content.toLowerCase().includes('design') || content.toLowerCase().includes('visual')) {
            setTimeout(() => {
              const canvasMsg: ChatMessageData = {
                id: `msg-canvas-${Date.now()}`,
                type: 'agent',
                content: "I've enabled Design Mode. You can now visually edit your UI components on the Canvas. Any changes you make will be synced back to your code automatically.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'canvas'
                }
              };
              set((state) => ({ messages: [...state.messages, canvasMsg] }));
            }, 4500);
          }

          // Mock App Testing trigger
          if (content.toLowerCase().includes('test my app') || content.toLowerCase().includes('automated test') || content.toLowerCase().includes('browser test')) {
            setTimeout(() => {
              const testingMsg: ChatMessageData = {
                id: `msg-testing-${Date.now()}`,
                type: 'agent',
                content: "I'll run an automated browser test on your app. I'll simulate a real user navigating through your login and dashboard flows to ensure everything is working as expected.",
                timestamp: Date.now(),
                metadata: {
                  action: 'open_tab',
                  tabType: 'testing'
                }
              };
              set((state) => ({ messages: [...state.messages, testingMsg] }));
            }, 5000);
          }
        }, 2000);
      }, 1000);
    }, 1000);
  },

  clearChat: () => set({ messages: [], currentThread: null, selectedContext: [] }),
  
  addContext: (item) => set((state) => ({
    selectedContext: [...state.selectedContext.filter(i => i.id !== item.id), item]
  })),
  
  removeContext: (id) => set((state) => ({
    selectedContext: state.selectedContext.filter(i => i.id !== id)
  })),
  
  setThread: (thread) => set({ currentThread: thread }),
  
  setPlanning: (planning) => set({ planning }),
  
  setAgentWorking: (working) => set({ isAgentWorking: working }),
}));
