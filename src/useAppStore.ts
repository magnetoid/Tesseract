/**
 * README: ArrayIDE State Management & Data Flow
 * 
 * This Zustand store powers both 'builder' and 'ide' modes, acting as the single source of truth.
 * 
 * Data Flow Between Modes:
 * 1. Mode Switching: `mode` state toggles the UI between the conversational Builder and the full IDE.
 *    `previousMode` allows for back-navigation. State is persisted to localStorage.
 * 2. Agent State: The 6 core agents (Orchestrator, Architect, Executor, Reasoner, Worker, Scout) 
 *    maintain their status, logs, and token usage across both modes. You can view their activity 
 *    in the Builder's chat or the IDE's AgentPanel.
 * 3. Chat State (Builder): Manages the conversation history. `simulateBuilderFlow` orchestrates 
 *    a mock sequence of agent interactions, updating agent statuses and triggering a build.
 * 4. File State (IDE): Manages the virtual file system. Files created or modified by agents in 
 *    Builder mode are immediately available in the IDE's file tree and editor tabs.
 * 5. Build State: Tracks the status of the preview build (idle, building, success, error), 
 *    shared between the Builder's preview panel and the IDE's terminal/status bars.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---

export type AppMode = 'builder' | 'ide';
export type AgentRole = 'orchestrator' | 'architect' | 'executor' | 'reasoner' | 'worker' | 'scout';
export type AgentStatus = 'idle' | 'thinking' | 'running' | 'done' | 'error';

export interface LogEntry {
  timestamp: number;
  text: string;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask: string;
  tokensUsed: number;
  tokenLimit: number;
  outputLog: LogEntry[];
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export type MessageRole = 'user' | 'orchestrator' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  agentId?: string;
  timestamp: number;
}

export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content?: string;
  extension?: string;
}

export type BuildStatus = 'idle' | 'building' | 'success' | 'error';

// --- Initial State ---

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Opus 4.6', role: 'orchestrator', status: 'idle', currentTask: 'Awaiting instructions.', tokensUsed: 0, tokenLimit: 8192, outputLog: [] },
  { id: '2', name: 'Sonnet 4.6', role: 'architect', status: 'idle', currentTask: 'Awaiting architectural tasks.', tokensUsed: 0, tokenLimit: 8192, outputLog: [] },
  { id: '3', name: 'GPT-5.3 Codex', role: 'executor', status: 'idle', currentTask: 'Awaiting execution commands.', tokensUsed: 0, tokenLimit: 4096, outputLog: [] },
  { id: '4', name: 'DeepSeek R1', role: 'reasoner', status: 'idle', currentTask: 'Awaiting complex algorithmic tasks.', tokensUsed: 0, tokenLimit: 8192, outputLog: [] },
  { id: '5', name: 'DeepSeek V3.2', role: 'worker', status: 'idle', currentTask: 'Awaiting implementation tasks.', tokensUsed: 0, tokenLimit: 8192, outputLog: [] },
  { id: '6', name: 'Kimi K2 Thinking', role: 'scout', status: 'idle', currentTask: 'Awaiting research tasks.', tokensUsed: 0, tokenLimit: 4096, outputLog: [] }
];

const INITIAL_MODELS: Record<AgentRole, string> = {
  orchestrator: 'claude-3-opus',
  architect: 'claude-3-sonnet',
  executor: 'gpt-5',
  reasoner: 'deepseek-reasoner',
  worker: 'deepseek-worker',
  scout: 'kimi-k2'
};

const INITIAL_FILES: FileNode[] = [
  { id: 'root', name: 'src', type: 'folder', parentId: null },
  { id: 'f1', name: 'App.tsx', type: 'file', parentId: 'root', extension: 'tsx', content: '// App.tsx content' },
  { id: 'f2', name: 'index.css', type: 'file', parentId: 'root', extension: 'css', content: '/* styles */' },
  { id: 'f3', name: 'utils.ts', type: 'file', parentId: 'root', extension: 'ts', content: '// utils' },
  { id: 'f4', name: 'package.json', type: 'file', parentId: null, extension: 'json', content: '{ "name": "app" }' },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Build me a modern landing page for a SaaS product called "Array". It should have a dark theme, a hero section with a glowing gradient, and a features grid.',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'msg-2',
    role: 'orchestrator',
    agentId: '1',
    content: 'I will orchestrate the creation of the "Array" SaaS landing page. I am breaking this down into three tasks:\n\n1. **Design & Structure**: The Architect will plan the component hierarchy and Tailwind theme.\n2. **Implementation**: The Worker will build the React components (Hero, Features, Footer).\n3. **Setup**: The Executor will ensure dependencies like `lucide-react` and `framer-motion` are installed.',
    timestamp: Date.now() - 55000,
  }
];

// --- Store Definition ---

interface AppState {
  // 1. MODE STATE
  mode: AppMode;
  previousMode: AppMode | null;
  setMode: (mode: AppMode) => void;

  // 2. AGENT STATE
  agents: Agent[];
  activeModels: Record<AgentRole, string>;
  agentMessages: AgentMessage[];
  updateAgentStatus: (role: AgentRole, status: AgentStatus) => void;
  appendAgentOutput: (role: AgentRole, text: string) => void;
  assignTask: (role: AgentRole, task: string) => void;
  broadcastTask: (task: string) => void;
  resetAllAgents: () => void;

  // 3. CHAT STATE
  messages: ChatMessage[];
  isOrchestratorThinking: boolean;
  sendUserMessage: (text: string, targetAgent?: string) => void;
  appendSystemMessage: (agentId: string, text: string) => void;
  clearChat: () => void;
  simulateBuilderFlow: (prompt: string) => Promise<void>;

  // 4. FILE STATE
  files: FileNode[];
  openTabs: string[];
  activeTab: string | null;
  openFile: (id: string) => void;
  closeTab: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  createFile: (name: string, type: FileType, parentId: string | null) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;

  // 5. BUILD STATE
  buildStatus: BuildStatus;
  buildTime: number;
  filesGenerated: number;
  totalTokens: number;
  previewUrl: string;
  triggerBuild: () => void;
  setBuildSuccess: (time: number, filesCount: number) => void;
  setBuildError: () => void;

  // 6. SETTINGS
  parallelLimit: number;
  autoRoute: boolean;
  apiKeys: Record<string, string>;
  setApiKeys: (keys: Record<string, string>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 1. MODE STATE
      mode: 'builder',
      previousMode: null,
      setMode: (mode) => set((state) => ({ previousMode: state.mode, mode })),

      // 2. AGENT STATE
      agents: INITIAL_AGENTS,
      activeModels: INITIAL_MODELS,
      agentMessages: [],
      updateAgentStatus: (role, status) => set((state) => ({
        agents: state.agents.map(a => a.role === role ? { ...a, status } : a)
      })),
      appendAgentOutput: (role, text) => set((state) => {
        const tokensAdded = Math.floor(Math.random() * 20) + 5;
        return {
          agents: state.agents.map(a => {
            if (a.role === role) {
              return {
                ...a,
                outputLog: [...a.outputLog, { timestamp: Date.now(), text }],
                tokensUsed: Math.min(a.tokensUsed + tokensAdded, a.tokenLimit)
              };
            }
            return a;
          }),
          totalTokens: state.totalTokens + tokensAdded
        };
      }),
      assignTask: (role, task) => set((state) => ({
        agents: state.agents.map(a => a.role === role ? { ...a, currentTask: task } : a)
      })),
      broadcastTask: (task) => {
        get().simulateBuilderFlow(task);
      },
      resetAllAgents: () => set((state) => ({
        agents: state.agents.map(a => ({
          ...a,
          status: 'idle',
          currentTask: 'Awaiting instructions.',
          outputLog: [],
          tokensUsed: 0
        }))
      })),

      // 3. CHAT STATE
      messages: INITIAL_CHAT_MESSAGES,
      isOrchestratorThinking: false,
      sendUserMessage: (text, targetAgent) => set((state) => ({
        messages: [...state.messages, {
          id: Date.now().toString(),
          role: 'user',
          content: text,
          agentId: targetAgent,
          timestamp: Date.now()
        }]
      })),
      appendSystemMessage: (agentId, text) => set((state) => ({
        messages: [...state.messages, {
          id: Date.now().toString(),
          role: 'system',
          content: text,
          agentId,
          timestamp: Date.now()
        }]
      })),
      clearChat: () => set({ messages: [] }),
      simulateBuilderFlow: async (prompt) => {
        const { sendUserMessage, appendSystemMessage, triggerBuild, setBuildSuccess, updateAgentStatus, assignTask, appendAgentOutput } = get();
        
        // a. Adds user message
        sendUserMessage(prompt);
        
        // b. Sets orchestrator thinking (1.5s)
        set({ isOrchestratorThinking: true });
        updateAgentStatus('orchestrator', 'thinking');
        assignTask('orchestrator', 'Analyzing user request...');
        
        await new Promise(r => setTimeout(r, 1500));
        set({ isOrchestratorThinking: false });
        updateAgentStatus('orchestrator', 'running');
        appendAgentOutput('orchestrator', 'Decomposing task into subtasks.');
        
        // c. Posts 3 system messages from different agents with 0.8s gaps
        const subtasks = [
          { role: 'architect' as AgentRole, msg: 'Architect assigned: Design component hierarchy.' },
          { role: 'worker' as AgentRole, msg: 'Worker assigned: Implement React components.' },
          { role: 'executor' as AgentRole, msg: 'Executor assigned: Setup build tools.' }
        ];
        
        for (const st of subtasks) {
          updateAgentStatus(st.role, 'thinking');
          assignTask(st.role, st.msg);
          appendSystemMessage(st.role, `→ ${st.msg}`);
          await new Promise(r => setTimeout(r, 800));
          updateAgentStatus(st.role, 'running');
          appendAgentOutput(st.role, `Executing: ${st.msg}`);
        }
        
        // d. Posts orchestrator reply
        set((state) => ({
          messages: [...state.messages, {
            id: Date.now().toString(),
            role: 'orchestrator',
            content: `I've broken down the task. The Architect is planning the structure, the Worker is building the components, and the Executor is setting up the environment.`,
            timestamp: Date.now()
          }]
        }));
        
        // e. Triggers a fake "build" that updates build stats
        triggerBuild();
        
        await new Promise(r => setTimeout(r, 2000));
        
        // Complete agents
        ['orchestrator', 'architect', 'worker', 'executor'].forEach(role => {
          updateAgentStatus(role as AgentRole, 'done');
          assignTask(role as AgentRole, 'Task completed successfully.');
          appendAgentOutput(role as AgentRole, 'Done.');
        });
        
        // f. Sets preview as "ready"
        setBuildSuccess(3.2, 12);
      },

      // 4. FILE STATE
      files: INITIAL_FILES,
      openTabs: ['f1', 'f2'],
      activeTab: 'f1',
      openFile: (id) => set((state) => {
        const isOpen = state.openTabs.includes(id);
        return {
          openTabs: isOpen ? state.openTabs : [...state.openTabs, id],
          activeTab: id
        };
      }),
      closeTab: (id) => set((state) => {
        const newTabs = state.openTabs.filter(t => t !== id);
        return {
          openTabs: newTabs,
          activeTab: state.activeTab === id ? (newTabs[newTabs.length - 1] || null) : state.activeTab
        };
      }),
      updateFileContent: (id, content) => set((state) => ({
        files: state.files.map(f => f.id === id ? { ...f, content } : f)
      })),
      createFile: (name, type, parentId) => set((state) => {
        const ext = name.split('.').pop();
        const newFile: FileNode = {
          id: `file-${Date.now()}`,
          name,
          type,
          parentId,
          extension: type === 'file' ? ext : undefined,
          content: type === 'file' ? '' : undefined
        };
        return { files: [...state.files, newFile] };
      }),
      deleteFile: (id) => set((state) => {
        const getIdsToDelete = (targetId: string): string[] => {
          const children = state.files.filter(f => f.parentId === targetId).map(f => f.id);
          return [targetId, ...children.flatMap(getIdsToDelete)];
        };
        const idsToDelete = getIdsToDelete(id);
        const newTabs = state.openTabs.filter(t => !idsToDelete.includes(t));
        
        return {
          files: state.files.filter(f => !idsToDelete.includes(f.id)),
          openTabs: newTabs,
          activeTab: idsToDelete.includes(state.activeTab!) ? (newTabs[newTabs.length - 1] || null) : state.activeTab
        };
      }),
      renameFile: (id, newName) => set((state) => {
        const ext = newName.split('.').pop();
        return {
          files: state.files.map(f => f.id === id ? { ...f, name: newName, extension: f.type === 'file' ? ext : undefined } : f)
        };
      }),

      // 5. BUILD STATE
      buildStatus: 'idle',
      buildTime: 0,
      filesGenerated: 0,
      totalTokens: 0,
      previewUrl: 'localhost:3000',
      triggerBuild: () => set({ buildStatus: 'building' }),
      setBuildSuccess: (time, filesCount) => set({
        buildStatus: 'success',
        buildTime: time,
        filesGenerated: filesCount,
        previewUrl: 'localhost:3000'
      }),
      setBuildError: () => set({ buildStatus: 'error' }),

      // 6. SETTINGS
      parallelLimit: 3,
      autoRoute: true,
      apiKeys: {},
      setApiKeys: (keys) => set({ apiKeys: keys }),
    }),
    {
      name: 'array-ide-storage',
      partialize: (state) => ({
        mode: state.mode,
        activeModels: state.activeModels,
        openTabs: state.openTabs,
        apiKeys: state.apiKeys,
        files: state.files,
      }),
    }
  )
);

// --- Typed Selectors ---

export const useMode = () => useAppStore((state) => state.mode);
export const useAgents = () => useAppStore((state) => state.agents);
export const useChatMessages = () => useAppStore((state) => state.messages);
export const useFiles = () => useAppStore((state) => state.files);
export const useBuildStatus = () => useAppStore((state) => ({
  status: state.buildStatus,
  time: state.buildTime,
  filesGenerated: state.filesGenerated,
  totalTokens: state.totalTokens,
  previewUrl: state.previewUrl
}));
