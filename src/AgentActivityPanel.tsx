import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useAgents, AgentRole } from './useAgentStore';
import { cn } from './lib/utils';

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

export default function AgentActivityPanel() {
  const agentsMap = useAgents();
  const agents = Object.values(agentsMap);

  return (
    <div className="w-full h-full bg-base border-l border-border-dim flex flex-col shrink-0">
      <div className="h-10 px-4 flex items-center text-xs font-semibold text-text-muted tracking-wider border-b border-border-dim shrink-0">
        AGENT ACTIVITY
      </div>
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full p-4">
          <div className="flex flex-col gap-4">
            {agents.map(agent => {
              const isActive = agent.status === 'running' || agent.status === 'thinking';
              return (
                <div key={agent.id} className={cn(
                  "bg-surface border border-border-dim rounded-lg p-3 flex flex-col gap-2 transition-all",
                  isActive && "ring-1 ring-accent/50 shadow-[0_0_15px_rgba(124,111,247,0.1)]"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getAgentColor(agent.role), isActive && "animate-pulse")} />
                      <span className="text-sm font-medium text-text-primary">{agent.name}</span>
                    </div>
                    <span className="text-xs text-text-muted uppercase">{agent.status}</span>
                  </div>
                  <div className="text-xs text-text-muted font-mono bg-base p-2 rounded border border-border-dim max-h-24 overflow-y-auto">
                    {agent.outputLog.slice(-3).map((log, i) => (
                      <div key={i} className="truncate">{log.text}</div>
                    ))}
                    {agent.outputLog.length === 0 && <span className="opacity-50">Idle...</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-elevated w-2.5 transition-colors">
          <ScrollArea.Thumb className="flex-1 bg-border-dim rounded-[10px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
