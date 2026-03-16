/**
 * README: ArrayIDE State Management & Data Flow
 * 
 * This Zustand store serves as the central nervous system for ArrayIDE.
 * 
 * Data Flow:
 * 1. User Input -> `simulateOrchestration(prompt)` is called.
 * 2. Orchestrator -> Changes state to 'thinking', creates a parent Task in the queue.
 * 3. Task Decomposition -> Orchestrator generates subtasks, adds them to the `tasks` array, 
 *    and dispatches messages to the `agentMessages` bus.
 * 4. Agent Execution -> Subtasks are assigned to specialized agents (Architect, Worker, etc.).
 *    Each agent transitions through 'idle' -> 'thinking' -> 'running' -> 'done'.
 * 5. Output Logging -> During execution, agents append strings to their `outputLog` and 
 *    increment their `tokensUsed`.
 * 6. UI Reactivity -> Components (AgentPanel, BottomPanel) subscribe to specific slices 
 *    of this store using the exported selectors (e.g., `useAgents`, `useMessages`) to 
 *    re-render only when their specific data changes.
 */

import { create } from 'zustand';

export type AgentRole = 'orchestrator' | 'architect' | 'executor' | 'reasoner' | 'worker' | 'scout';
export type AgentStatus = 'idle' | 'thinking' | 'running' | 'done' | 'error';

export interface LogEntry {
  timestamp: number;
  text: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask: string;
  tokensUsed: number;
  tokenLimit: number;
  outputLog: LogEntry[];
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'running' | 'done' | 'error';

export interface Task {
  id: string;
  description: string;
  assignedAgent: AgentRole | null;
  parentTaskId: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
  completedAt?: number;
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

export interface AgentConfig {
  model: string;
  tokenBudget: number;
  temperature: number;
  enabled: boolean;
}

export type MessageRole = 'user' | 'orchestrator' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  agentName?: string;
  agentRole?: AgentRole;
  timestamp: number;
}

export interface Settings {
  agentConfigs: Record<AgentRole, AgentConfig>;
  parallelLimit: number;
  autoRoute: boolean;
}

interface AgentStore {
  // State
  mode: 'builder' | 'ide';
  projectName: string;
  agents: Record<AgentRole, Agent>;
  tasks: Task[];
  agentMessages: AgentMessage[];
  chatMessages: ChatMessage[];
  settings: Settings;

  // Actions
  setMode: (mode: 'builder' | 'ide') => void;
  setProjectName: (name: string) => void;
  updateAgentStatus: (role: AgentRole, status: AgentStatus) => void;
  appendOutput: (role: AgentRole, output: string) => void;
  assignTask: (role: AgentRole, taskDescription: string) => void;
  resetAgent: (role: AgentRole) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => string;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addMessage: (from: string, to: string, content: string) => void;
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  updateSettings: (newSettings: Partial<Settings>) => void;

  // Simulation
  simulateOrchestration: (userPrompt: string) => Promise<void>;
}

const INITIAL_AGENTS: Record<AgentRole, Agent> = {
  orchestrator: {
    id: '1', name: 'Opus 4.6', model: 'claude-3-opus', role: 'orchestrator',
    status: 'idle', currentTask: 'Awaiting instructions.', tokensUsed: 0, tokenLimit: 8192, outputLog: []
  },
  architect: {
    id: '2', name: 'Sonnet 4.6', model: 'claude-3-sonnet', role: 'architect',
    status: 'idle', currentTask: 'Awaiting architectural tasks.', tokensUsed: 0, tokenLimit: 8192, outputLog: []
  },
  executor: {
    id: '3', name: 'GPT-5.3 Codex', model: 'gpt-5', role: 'executor',
    status: 'idle', currentTask: 'Awaiting execution commands.', tokensUsed: 0, tokenLimit: 4096, outputLog: []
  },
  reasoner: {
    id: '4', name: 'DeepSeek R1', model: 'deepseek-reasoner', role: 'reasoner',
    status: 'idle', currentTask: 'Awaiting complex algorithmic tasks.', tokensUsed: 0, tokenLimit: 8192, outputLog: []
  },
  worker: {
    id: '5', name: 'DeepSeek V3.2', model: 'deepseek-worker', role: 'worker',
    status: 'idle', currentTask: 'Awaiting implementation tasks.', tokensUsed: 0, tokenLimit: 8192, outputLog: []
  },
  scout: {
    id: '6', name: 'Kimi K2 Thinking', model: 'kimi-k2', role: 'scout',
    status: 'idle', currentTask: 'Awaiting research tasks.', tokensUsed: 0, tokenLimit: 4096, outputLog: []
  }
};

export const DEFAULT_AGENT_CONFIGS: Record<AgentRole, AgentConfig> = {
  orchestrator: { model: 'claude-opus-4-6', tokenBudget: 32000, temperature: 0.2, enabled: true },
  architect: { model: 'claude-sonnet-4-6', tokenBudget: 64000, temperature: 0.4, enabled: true },
  executor: { model: 'gpt-5.3-codex', tokenBudget: 16000, temperature: 0.1, enabled: true },
  reasoner: { model: 'deepseek-r1', tokenBudget: 128000, temperature: 0.7, enabled: true },
  worker: { model: 'deepseek-v3.2', tokenBudget: 64000, temperature: 0.3, enabled: true },
  scout: { model: 'kimi-k2-thinking', tokenBudget: 32000, temperature: 0.5, enabled: true }
};

const INITIAL_SETTINGS: Settings = {
  agentConfigs: DEFAULT_AGENT_CONFIGS,
  parallelLimit: 3,
  autoRoute: true
};

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
    agentName: 'Opus 4.6',
    agentRole: 'orchestrator',
    content: 'I will orchestrate the creation of the "Array" SaaS landing page. I am breaking this down into three tasks:\n\n1. **Design & Structure**: The Architect will plan the component hierarchy and Tailwind theme.\n2. **Implementation**: The Worker will build the React components (Hero, Features, Footer).\n3. **Setup**: The Executor will ensure dependencies like `lucide-react` and `framer-motion` are installed.',
    timestamp: Date.now() - 55000,
  },
  {
    id: 'msg-3',
    role: 'system',
    agentRole: 'architect',
    content: '→ Architect assigned: Design component hierarchy and Tailwind theme',
    timestamp: Date.now() - 50000,
  },
  {
    id: 'msg-4',
    role: 'system',
    agentRole: 'worker',
    content: '→ Worker assigned: Implement React components (Hero, Features, Footer)',
    timestamp: Date.now() - 45000,
  },
  {
    id: 'msg-5',
    role: 'system',
    agentRole: 'executor',
    content: '→ Executor assigned: Install dependencies (lucide-react, framer-motion)',
    timestamp: Date.now() - 40000,
  }
];

export const useAgentStore = create<AgentStore>((set, get) => ({
  mode: 'builder',
  projectName: 'ArrayIDE-Prototype',
  agents: INITIAL_AGENTS,
  tasks: [],
  agentMessages: [],
  chatMessages: INITIAL_CHAT_MESSAGES,
  settings: INITIAL_SETTINGS,

  setMode: (mode) => set({ mode }),
  setProjectName: (projectName) => set({ projectName }),

  updateAgentStatus: (role, status) => set((state) => ({
    agents: {
      ...state.agents,
      [role]: { ...state.agents[role], status }
    }
  })),

  appendOutput: (role, output) => set((state) => {
    const agent = state.agents[role];
    const tokensAdded = Math.floor(Math.random() * 50) + 10;
    return {
      agents: {
        ...state.agents,
        [role]: { 
          ...agent, 
          outputLog: [...agent.outputLog, { timestamp: Date.now(), text: output }],
          tokensUsed: Math.min(agent.tokensUsed + tokensAdded, agent.tokenLimit)
        }
      }
    };
  }),

  assignTask: (role, taskDescription) => set((state) => ({
    agents: {
      ...state.agents,
      [role]: { ...state.agents[role], currentTask: taskDescription }
    }
  })),

  resetAgent: (role) => set((state) => ({
    agents: {
      ...state.agents,
      [role]: { 
        ...state.agents[role], 
        status: 'idle', 
        currentTask: 'Awaiting instructions.', 
        outputLog: [], 
        tokensUsed: 0 
      }
    }
  })),

  addTask: (task) => {
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = { ...task, id, status: 'pending', createdAt: Date.now() };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    return id;
  },

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { 
      ...t, 
      status, 
      completedAt: status === 'done' ? Date.now() : t.completedAt 
    } : t)
  })),

  addMessage: (from, to, content) => set((state) => ({
    agentMessages: [...state.agentMessages, {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      content,
      timestamp: Date.now()
    }]
  })),

  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, {
      ...message,
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }]
  })),

  clearChat: () => set({ chatMessages: [] }),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  simulateOrchestration: async (userPrompt: string) => {
    const { updateAgentStatus, assignTask, addMessage, appendOutput, addTask, updateTaskStatus } = get();
    
    // 1. Orchestrator starts thinking
    updateAgentStatus('orchestrator', 'thinking');
    assignTask('orchestrator', `Decomposing: "${userPrompt}"`);
    addMessage('User', 'Orchestrator', `New prompt received: ${userPrompt}`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // 2. Orchestrator generates subtasks
    updateAgentStatus('orchestrator', 'running');
    appendOutput('orchestrator', `> Analyzed prompt. Breaking down into 3 subtasks.`);
    
    const parentTaskId = addTask({
      description: userPrompt,
      assignedAgent: 'orchestrator',
      parentTaskId: null,
      priority: 'high'
    });
    updateTaskStatus(parentTaskId, 'running');

    const subtasks = [
      { role: 'architect' as AgentRole, desc: 'Design component architecture and state flow.' },
      { role: 'worker' as AgentRole, desc: 'Implement UI components based on architecture.' },
      { role: 'executor' as AgentRole, desc: 'Setup build tools and install dependencies.' }
    ];

    const subtaskIds = subtasks.map(st => {
      const id = addTask({
        description: st.desc,
        assignedAgent: st.role,
        parentTaskId: parentTaskId,
        priority: 'medium'
      });
      addMessage('Orchestrator', st.role.charAt(0).toUpperCase() + st.role.slice(1), `Assigned task: ${st.desc}`);
      return { id, ...st };
    });

    // 3. Run agents concurrently with staggered starts
    await Promise.all(subtaskIds.map(async (st, index) => {
      // Stagger start
      await new Promise(resolve => setTimeout(resolve, 500 * (index + 1)));
      
      updateAgentStatus(st.role, 'thinking');
      assignTask(st.role, st.desc);
      updateTaskStatus(st.id, 'running');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateAgentStatus(st.role, 'running');
      appendOutput(st.role, `> Starting task: ${st.desc}`);
      
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      appendOutput(st.role, `> Processing... generating code/commands.`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      appendOutput(st.role, `> Task complete.`);
      updateAgentStatus(st.role, 'done');
      updateTaskStatus(st.id, 'done');
      addMessage(st.role.charAt(0).toUpperCase() + st.role.slice(1), 'Orchestrator', `Completed task: ${st.desc}`);
    }));

    // 4. Mark all done
    updateAgentStatus('orchestrator', 'done');
    appendOutput('orchestrator', `> All subtasks completed successfully. Finalizing.`);
    addMessage('Orchestrator', 'All', 'Orchestration complete.');
    updateTaskStatus(parentTaskId, 'done');
  }
}));

// --- Typed Selectors ---
export const useAgents = () => useAgentStore(state => state.agents);
export const useAgentMessages = () => useAgentStore(state => state.agentMessages);
export const useTasks = () => useAgentStore(state => state.tasks);
export const useChatMessages = () => useAgentStore(state => state.chatMessages);
export const useSettings = () => useAgentStore(state => state.settings);
export const useSimulateOrchestration = () => useAgentStore(state => state.simulateOrchestration);
export const useMode = () => useAgentStore(state => state.mode);
export const useProjectName = () => useAgentStore(state => state.projectName);
export const useSetMode = () => useAgentStore(state => state.setMode);
export const useSetProjectName = () => useAgentStore(state => state.setProjectName);
