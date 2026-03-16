import React, { useState, useRef, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Select from '@radix-ui/react-select';
import * as Tooltip from '@radix-ui/react-tooltip';
import TextareaAutosize from 'react-textarea-autosize';
import { ChevronRight, ChevronDown, Paperclip, Send, ChevronUp, Bot } from 'lucide-react';
import { useAgents, useChatMessages, useAgentStore, AgentRole, AgentStatus } from './useAgentStore';
import { cn } from './utils';

const getAgentColor = (role: AgentRole) => {
  switch (role) {
    case 'orchestrator': return 'bg-purple-500';
    case 'architect': return 'bg-cyan-500';
    case 'executor': return 'bg-blue-500';
    case 'reasoner': return 'bg-amber-500';
    case 'worker': return 'bg-gray-400';
    case 'scout': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
};

const getAgentTextColor = (role: AgentRole) => {
  switch (role) {
    case 'orchestrator': return 'text-purple-400';
    case 'architect': return 'text-cyan-400';
    case 'executor': return 'text-blue-400';
    case 'reasoner': return 'text-amber-400';
    case 'worker': return 'text-gray-400';
    case 'scout': return 'text-pink-400';
    default: return 'text-gray-400';
  }
};

const ThinkingIndicator = ({ label }: { label: string }) => (
  <div className="flex flex-col gap-1 items-start mb-4">
    <div className="text-xs text-text-muted ml-2">{label} is thinking...</div>
    <div className="bg-elevated rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 w-fit">
      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-[bounce_1s_infinite_0ms]" />
      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-[bounce_1s_infinite_200ms]" />
      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-[bounce_1s_infinite_400ms]" />
    </div>
  </div>
);

// Simple markdown renderer for bold and inline code
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-base text-accent px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    // Handle newlines
    return <span key={i}>{part.split('\n').map((line, j) => (
      <React.Fragment key={j}>
        {j > 0 && <br />}
        {line}
      </React.Fragment>
    ))}</span>;
  });
};

export default function ChatPanel() {
  const agentsMap = useAgents();
  const agents = Object.values(agentsMap);
  const messages = useChatMessages();
  const addChatMessage = useAgentStore(state => state.addChatMessage);
  const simulateOrchestration = useAgentStore(state => state.simulateOrchestration);
  
  const [isAgentsBarOpen, setIsAgentsBarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('orchestrator');
  const [isThinking, setIsThinking] = useState(false);
  
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const text = inputValue.trim();
    setInputValue('');
    
    // Add user message
    addChatMessage({
      role: 'user',
      content: text,
    });
    
    setIsThinking(true);
    
    // Simulate network delay before orchestrator responds
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsThinking(false);
    
    // Trigger the actual orchestration simulation which will add system messages
    simulateOrchestration(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const estimatedTokens = Math.max(0, Math.ceil(inputValue.length / 4));

  return (
    <div className="w-[420px] h-full flex flex-col bg-base border-r border-border-dim shrink-0">
      
      {/* SECTION 1: Agent Mini-bar */}
      <div className="flex flex-col shrink-0 border-b border-border-dim bg-surface">
        <div 
          className="h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-elevated transition-colors select-none"
          onClick={() => setIsAgentsBarOpen(!isAgentsBarOpen)}
        >
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <Bot size={14} /> Agents
          </div>
          <div className="text-text-muted">
            {isAgentsBarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        
        {isAgentsBarOpen && (
          <div className="px-4 pb-3 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {agents.map(agent => {
              const isActive = agent.status === 'running' || agent.status === 'thinking';
              return (
                <Popover.Root key={agent.id}>
                  <Popover.Trigger asChild>
                    <button className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-full bg-elevated border border-border-dim text-xs font-medium text-text-primary hover:bg-border-dim transition-all shrink-0 outline-none",
                      isActive && "ring-1 ring-accent/50 shadow-[0_0_10px_rgba(124,111,247,0.2)]"
                    )}>
                      <div className={cn("w-2 h-2 rounded-full", getAgentColor(agent.role), isActive && "animate-pulse")} />
                      {agent.name.split(' ')[0]}
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content 
                      className="bg-elevated border border-border-dim rounded-md shadow-xl p-2 w-64 z-50"
                      sideOffset={5}
                    >
                      <div className="text-xs font-semibold text-text-primary mb-1">{agent.name} Output</div>
                      <div className="font-mono text-[10px] text-text-muted flex flex-col gap-0.5 max-h-32 overflow-y-auto">
                        {agent.outputLog.slice(-5).map((log, i) => (
                          <div key={i} className="truncate">{log.text}</div>
                        ))}
                        {agent.outputLog.length === 0 && <div className="italic opacity-50">No output yet...</div>}
                      </div>
                      <Popover.Arrow className="fill-border-dim" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Message Thread */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full p-4" ref={scrollViewportRef}>
          <div className="flex flex-col gap-6">
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end gap-2 w-full">
                    <div className="max-w-[85%] bg-accent/15 text-text-primary rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed border border-accent/10 shadow-sm">
                      {msg.content}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
                      U
                    </div>
                  </div>
                );
              }
              
              if (msg.role === 'orchestrator') {
                return (
                  <div key={msg.id} className="flex flex-col gap-1 items-start w-full">
                    <div className="text-xs text-text-muted ml-2 font-medium">
                      {msg.agentName} · {msg.agentRole}
                    </div>
                    <div className="max-w-[85%] bg-elevated text-text-primary rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed border border-border-dim shadow-sm">
                      {renderMarkdown(msg.content)}
                    </div>
                  </div>
                );
              }
              
              if (msg.role === 'system') {
                return (
                  <div key={msg.id} className="w-full flex justify-center my-2">
                    <div className="flex items-center gap-2 text-xs text-text-muted italic opacity-70 bg-surface px-3 py-1 rounded-full border border-border-dim">
                      {msg.agentRole && <div className={cn("w-1.5 h-1.5 rounded-full", getAgentColor(msg.agentRole))} />}
                      {msg.content}
                    </div>
                  </div>
                );
              }
              
              return null;
            })}
            
            {isThinking && <ThinkingIndicator label="Orchestrator" />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-elevated w-2.5 transition-colors">
          <ScrollArea.Thumb className="flex-1 bg-border-dim rounded-[10px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* SECTION 3: Input Zone */}
      <div className="p-3 border-t border-border-dim bg-surface shrink-0">
        <div className="bg-base border border-border-dim rounded-xl focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm flex flex-col">
          <TextareaAutosize
            minRows={2}
            maxRows={6}
            placeholder="Describe what you want to build..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none resize-none text-sm text-text-primary placeholder:text-text-muted p-3"
          />
          
          <div className="flex items-center justify-between p-2 pt-0">
            <div className="flex items-center gap-2">
              <Select.Root value={selectedAgent} onValueChange={(v) => setSelectedAgent(v as AgentRole)}>
                <Select.Trigger className="flex items-center gap-1.5 px-2 py-1 bg-elevated hover:bg-border-dim border border-border-dim rounded-md text-xs text-text-primary outline-none transition-colors">
                  <Select.Value />
                  <Select.Icon><ChevronDown size={12} className="text-text-muted" /></Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-elevated border border-border-dim rounded-md shadow-xl z-50 overflow-hidden">
                    <Select.Viewport className="p-1">
                      {agents.map(a => (
                        <Select.Item key={a.role} value={a.role} className="text-xs px-6 py-1.5 outline-none cursor-pointer hover:bg-accent/20 hover:text-accent rounded-sm text-text-primary flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", getAgentColor(a.role))} />
                          <Select.ItemText>{a.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              
              <div className="px-2 py-1 bg-elevated border border-border-dim rounded-md text-[10px] font-mono text-text-muted">
                ~{estimatedTokens} tokens
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-elevated rounded-md transition-colors outline-none">
                      <Paperclip size={16} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-elevated text-text-primary text-xs px-2 py-1 rounded border border-border-dim shadow-xl z-50" sideOffset={5}>
                      Attach file or screenshot
                      <Tooltip.Arrow className="fill-border-dim" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button 
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="p-1.5 bg-accent hover:bg-accent/90 disabled:bg-border-dim disabled:text-text-muted text-white rounded-md transition-colors outline-none shadow-sm ml-1"
                    >
                      <Send size={16} className={inputValue.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-elevated text-text-primary text-xs px-2 py-1 rounded border border-border-dim shadow-xl z-50" sideOffset={5}>
                      Send message (Cmd+Enter)
                      <Tooltip.Arrow className="fill-border-dim" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
