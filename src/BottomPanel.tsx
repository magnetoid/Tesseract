import React, { useState, useRef, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  Terminal,
  ListTree,
  Trash2,
  Download,
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useAgents, useTasks, Task } from "./useAgentStore";

type LogSource =
  | "ORCHESTRATOR"
  | "EXECUTOR"
  | "REASONER"
  | "WORKER"
  | "SYSTEM"
  | "ARCHITECT"
  | "SCOUT";

interface TerminalLog {
  id: string;
  time: string;
  source: LogSource;
  text: string;
  timestamp: number;
}

interface TaskNodeData {
  id: string;
  title: string;
  agentRole: string;
  status: "done" | "running" | "idle" | "error" | "pending";
  duration: string;
  children?: TaskNodeData[];
}

const getSourceColor = (source: LogSource) => {
  switch (source) {
    case "ORCHESTRATOR":
      return "text-purple-400";
    case "EXECUTOR":
      return "text-blue-400";
    case "REASONER":
      return "text-amber-400";
    case "WORKER":
      return "text-gray-400";
    case "ARCHITECT":
      return "text-cyan-400";
    case "SCOUT":
      return "text-pink-400";
    case "SYSTEM":
      return "text-text-primary";
    default:
      return "text-text-muted";
  }
};

const getAgentColor = (role: string) => {
  switch (role) {
    case "orchestrator":
      return "bg-purple-500";
    case "architect":
      return "bg-cyan-500";
    case "executor":
      return "bg-blue-500";
    case "reasoner":
      return "bg-amber-500";
    case "worker":
      return "bg-gray-400";
    case "scout":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "done":
      return <CheckCircle2 size={14} className="text-emerald-500" />;
    case "running":
      return <PlayCircle size={14} className="text-blue-500" />;
    case "error":
      return <XCircle size={14} className="text-red-500" />;
    case "idle":
    case "pending":
    default:
      return <CircleDashed size={14} className="text-text-muted" />;
  }
};

const TaskTreeNode: React.FC<{ node: TaskNodeData; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <div
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-elevated cursor-pointer rounded-sm group select-none transition-colors"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            <div
              className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )
              ) : (
                <div className="w-1" />
              )}
            </div>

            <div
              className={`w-2 h-2 rounded-full ${getAgentColor(node.agentRole)} shadow-sm`}
              title={`Assigned to: ${node.agentRole}`}
            />

            <span className="text-sm text-text-primary flex-1 truncate">
              {node.title}
            </span>

            <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-text-muted font-mono">
                {node.duration}
              </span>
              {getStatusIcon(node.status)}
            </div>
          </div>
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Content className="min-w-[160px] bg-surface border border-border-dim rounded-md p-1 shadow-xl z-50 text-sm text-text-primary">
            <ContextMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-elevated hover:text-accent rounded-sm">
              Reassign agent
            </ContextMenu.Item>
            <ContextMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-elevated hover:text-emerald-400 rounded-sm">
              Mark done
            </ContextMenu.Item>
            <ContextMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-elevated rounded-sm">
              View output
            </ContextMenu.Item>
            <ContextMenu.Separator className="h-[1px] bg-border-dim my-1" />
            <ContextMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-elevated hover:text-red-400 rounded-sm">
              Cancel task
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      {isOpen && hasChildren && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <TaskTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function BottomPanel() {
  const [height, setHeight] = useState(220);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const agentsMap = useAgents();
  const agents = Object.values(agentsMap);
  const tasks = useTasks();

  const [localLogs, setLocalLogs] = useState<TerminalLog[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Merge agent logs with local terminal inputs
  const allLogs = [
    ...localLogs,
    ...agents.flatMap((a) =>
      a.outputLog.map((l) => ({
        id: `${a.id}-${l.timestamp}-${Math.random()}`,
        time: new Date(l.timestamp).toLocaleTimeString("en-US", {
          hour12: false,
        }),
        source: a.role.toUpperCase() as LogSource,
        text: l.text,
        timestamp: l.timestamp,
      })),
    ),
  ].sort((a, b) => a.timestamp - b.timestamp);

  // Build task tree
  const buildTree = (parentId: string | null): TaskNodeData[] => {
    return tasks
      .filter((t) => t.parentTaskId === parentId)
      .map((t) => ({
        id: t.id,
        title: t.description,
        agentRole: t.assignedAgent || "system",
        status: t.status as any,
        duration: t.completedAt
          ? `${((t.completedAt - t.createdAt) / 1000).toFixed(1)}s`
          : "...",
        children: buildTree(t.id),
      }));
  };
  const treeData = buildTree(null);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.cursor = "row-resize";
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const delta = startY.current - e.clientY;
      const newHeight = Math.min(
        Math.max(startHeight.current + delta, 120),
        window.innerHeight * 0.5,
      );
      setHeight(newHeight);
    };
    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "default";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allLogs.length]);

  const handleTerminalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newLog: TerminalLog = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        source: "EXECUTOR",
        text: `$ ${inputValue}`,
        timestamp: Date.now(),
      };
      setLocalLogs([...localLogs, newLog]);
      setInputValue("");
    }
  };

  return (
    <div
      className="flex flex-col bg-base border-t border-border-dim shrink-0 relative"
      style={{ height: `${height}px` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1.5 -mt-[1px] cursor-row-resize z-10 hover:bg-accent/50 transition-colors"
        onMouseDown={onMouseDown}
      />

      <Tabs.Root defaultValue="terminal" className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-border-dim bg-surface px-2">
          <Tabs.List className="flex">
            <Tabs.Trigger
              value="terminal"
              className="px-4 py-2 text-xs font-medium text-text-muted data-[state=active]:text-text-primary data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-text-primary outline-none flex items-center gap-2 transition-colors"
            >
              <Terminal size={14} /> Terminal
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tasks"
              className="px-4 py-2 text-xs font-medium text-text-muted data-[state=active]:text-text-primary data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-text-primary outline-none flex items-center gap-2 transition-colors"
            >
              <ListTree size={14} /> Task Tree
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLocalLogs([])}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-elevated rounded transition-colors"
              title="Clear Terminal"
            >
              <Trash2 size={14} />
            </button>
            <button
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-elevated rounded transition-colors"
              title="Export Log"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        <Tabs.Content
          value="terminal"
          className="flex-1 flex flex-col min-h-0 outline-none bg-base"
        >
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport
              className="w-full h-full p-3"
              ref={scrollViewportRef}
            >
              <div className="flex flex-col gap-1 font-mono text-[13px] leading-relaxed">
                {allLogs.length === 0 && (
                  <div className="text-text-muted italic">
                    No terminal output...
                  </div>
                )}
                {allLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex gap-3 hover:bg-white/5 px-1 rounded-sm transition-colors"
                  >
                    <span className="text-text-muted shrink-0 select-none">
                      {log.time}
                    </span>
                    <span
                      className={`shrink-0 font-semibold w-[110px] ${getSourceColor(log.source)}`}
                    >
                      [{log.source}]
                    </span>
                    <span className="text-text-primary break-all">
                      {log.text}
                    </span>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex select-none touch-none p-0.5 bg-transparent hover:bg-elevated w-2.5 transition-colors"
            >
              <ScrollArea.Thumb className="flex-1 bg-border-dim rounded-[10px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>

          <div className="flex items-center px-3 py-2 border-t border-border-dim/50 bg-base shrink-0">
            <span className="text-blue-400 font-mono text-[13px] font-bold mr-2 select-none">
              {">_"}
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTerminalSubmit}
              placeholder="Send command to Executor..."
              className="flex-1 bg-transparent border-none outline-none text-[13px] font-mono text-text-primary placeholder:text-text-muted/50"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </Tabs.Content>

        <Tabs.Content
          value="tasks"
          className="flex-1 min-h-0 outline-none bg-base"
        >
          <ScrollArea.Root className="h-full w-full">
            <ScrollArea.Viewport className="w-full h-full p-2">
              {treeData.length === 0 && (
                <div className="text-text-muted italic p-2">
                  No active tasks...
                </div>
              )}
              {treeData.map((node) => (
                <TaskTreeNode key={node.id} node={node} />
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex select-none touch-none p-0.5 bg-transparent hover:bg-elevated w-2.5 transition-colors"
            >
              <ScrollArea.Thumb className="flex-1 bg-border-dim rounded-[10px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
