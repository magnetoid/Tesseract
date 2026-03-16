import React, { useState, useEffect } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Progress from "@radix-ui/react-progress";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Send, ChevronDown, ChevronRight, Bot, Activity } from "lucide-react";
import {
  useAgents,
  useAgentMessages,
  useSimulateOrchestration,
  useTasks,
  Agent,
} from "./useAgentStore";

const getStatusColor = (status: Agent["status"]) => {
  switch (status) {
    case "idle":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "thinking":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse";
    case "running":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "done":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "error":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const AgentCard: React.FC<{ agent: Agent; isHighlighted: boolean }> = ({
  agent,
  isHighlighted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const progress = (agent.tokensUsed / agent.tokenLimit) * 100;

  return (
    <div
      className={`p-[1px] rounded-md transition-all duration-300 ${
        agent.status === "running"
          ? "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
          : "bg-[var(--border)]"
      } ${isHighlighted ? "ring-2 ring-[var(--accent)] shadow-[0_0_15px_rgba(124,111,247,0.3)]" : ""}`}
    >
      <div className="p-3 rounded-md bg-[var(--bg-elevated)] flex flex-col gap-2 shadow-sm h-full">
        {/* Header: Name, Role, Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {agent.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              · {agent.role}
            </span>
          </div>
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${getStatusColor(agent.status)}`}
          >
            {agent.status}
          </div>
        </div>

        {/* Current Task with Tooltip */}
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="text-xs text-[var(--text-muted)] truncate cursor-default">
                {agent.currentTask}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs p-2 rounded border border-[var(--border)] shadow-xl max-w-[250px] z-50 leading-relaxed"
                sideOffset={5}
              >
                {agent.currentTask}
                <Tooltip.Arrow className="fill-[var(--border)]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        {/* Token Progress */}
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
            <span>Tokens</span>
            <span>
              {agent.tokensUsed.toLocaleString()} /{" "}
              {agent.tokenLimit.toLocaleString()}
            </span>
          </div>
          <Progress.Root
            className="h-1.5 w-full bg-[var(--bg-base)] overflow-hidden rounded-full border border-[var(--border)]"
            value={progress}
          >
            <Progress.Indicator
              className="h-full bg-[var(--accent)] transition-all duration-500 ease-in-out"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </div>

        {/* Output Log Preview / Collapsible */}
        <div className="mt-1 bg-[var(--bg-base)] rounded p-2 border border-[var(--border)] font-mono text-[10px] text-[var(--text-muted)]">
          {!isOpen && (
            <div className="flex flex-col gap-0.5">
              {agent.outputLog.slice(-2).map((log, i) => (
                <div key={i} className="truncate">
                  {log.text}
                </div>
              ))}
              {agent.outputLog.length === 0 && (
                <div className="opacity-50 italic">No output yet...</div>
              )}
            </div>
          )}

          <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Content>
              <div className="max-h-32 overflow-y-auto flex flex-col gap-1 pb-1">
                {agent.outputLog.map((log, i) => (
                  <div key={i} className="break-words">
                    {log.text}
                  </div>
                ))}
              </div>
            </Collapsible.Content>
            <Collapsible.Trigger asChild>
              <button className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-1.5 transition-colors w-full justify-center py-0.5 bg-[var(--bg-surface)] rounded border border-[var(--border)] cursor-pointer">
                {isOpen ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                {isOpen ? "Collapse" : "Expand full log"}
              </button>
            </Collapsible.Trigger>
          </Collapsible.Root>
        </div>
      </div>
    </div>
  );
};

export default function AgentPanel() {
  const agentsMap = useAgents();
  const agents = Object.values(agentsMap);
  const messages = useAgentMessages();
  const tasks = useTasks();
  const simulateOrchestration = useSimulateOrchestration();

  const [highlightedRole, setHighlightedRole] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handleHighlight = (e: CustomEvent) => {
      setHighlightedRole(e.detail);
      setTimeout(() => setHighlightedRole(null), 2000);
    };
    window.addEventListener(
      "highlight-agent",
      handleHighlight as EventListener,
    );
    return () =>
      window.removeEventListener(
        "highlight-agent",
        handleHighlight as EventListener,
      );
  }, []);

  const handleBroadcast = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      simulateOrchestration(inputValue.trim());
      setInputValue("");
    }
  };

  const activeCount = agents.filter(
    (a) => a.status === "running" || a.status === "thinking",
  ).length;
  const isIdle =
    agents.every((a) => a.status === "idle" || a.status === "done") &&
    tasks.length === 0;

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-surface)]">
      {/* Header */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-[var(--border)] shrink-0">
        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
          <Bot size={14} /> Agent Roster
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${activeCount > 0 ? "bg-[var(--accent)] animate-pulse" : "bg-gray-500"}`}
          />
          <span className="text-xs text-[var(--text-muted)]">
            {activeCount} Active
          </span>
        </div>
      </div>

      {/* Broadcast Input */}
      <form
        onSubmit={handleBroadcast}
        className="p-3 border-b border-[var(--border)] shrink-0 bg-[var(--bg-base)]"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Broadcast task to Orchestrator..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-md py-1.5 pl-3 pr-8 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors rounded cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {/* Agent Cards Scroll Area */}
      {isIdle ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center text-[var(--text-muted)] text-sm">
          Broadcast a task to the Orchestrator to begin orchestration.
        </div>
      ) : (
        <ScrollArea.Root className="flex-1 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full p-3">
            <div className="flex flex-col gap-3">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isHighlighted={highlightedRole === agent.role}
                />
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[var(--bg-elevated)] w-2.5 transition-colors"
          >
            <ScrollArea.Thumb className="flex-1 bg-[var(--border)] rounded-[10px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}

      {/* Network Feed */}
      <div className="h-40 border-t border-[var(--border)] bg-[var(--bg-base)] flex flex-col shrink-0">
        <div className="px-3 py-2 border-b border-[var(--border)] text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5 bg-[var(--bg-surface)]">
          <Activity size={12} /> Network Feed
        </div>
        <ScrollArea.Root className="flex-1 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full p-2">
            <div className="flex flex-col gap-1.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="text-[11px] font-mono text-[var(--text-muted)] leading-tight"
                >
                  <span className="text-[var(--accent)]">{msg.from}</span>
                  <span className="opacity-50 mx-1">→</span>
                  <span className="text-blue-400">{msg.to}</span>
                  <span className="opacity-50">: </span>
                  <span className="text-[var(--text-primary)]">
                    {msg.content}
                  </span>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-[11px] text-[var(--text-muted)] italic text-center mt-4">
                  No network activity
                </div>
              )}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[var(--bg-elevated)] w-2 transition-colors"
          >
            <ScrollArea.Thumb className="flex-1 bg-[var(--border)] rounded-[10px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  );
}
