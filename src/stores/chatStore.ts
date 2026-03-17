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
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isAgentWorking: false,
  currentThread: null,
  selectedContext: [],
  planning: false,

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
