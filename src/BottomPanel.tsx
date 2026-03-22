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
  Rocket,
  ExternalLink,
  Eye,
  RotateCcw,
  Clock,
  Hash,
  Activity
} from "lucide-react";
import { useAgents, useTasks, Task } from "./useAgentStore";
import { useAppStore } from "./useAppStore";
import { cn } from "./lib/utils";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

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
      return "text-accent";
    case "EXECUTOR":
      return "text-info";
    case "REASONER":
      return "text-warning";
    case "WORKER":
      return "text-secondary";
    case "ARCHITECT":
      return "text-info";
    case "SCOUT":
      return "text-accent";
    case "SYSTEM":
      return "text-primary";
    default:
      return "text-secondary";
  }
};

const getAgentColor = (role: string) => {
  switch (role) {
    case "orchestrator":
      return "bg-accent";
    case "architect":
      return "bg-info";
    case "executor":
      return "bg-info";
    case "reasoner":
      return "bg-warning";
    case "worker":
      return "bg-secondary";
    case "scout":
      return "bg-accent";
    default:
      return "bg-secondary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "done":
      return <CheckCircle2 size={14} className="text-success" />;
    case "running":
      return <PlayCircle size={14} className="text-info" />;
    case "error":
      return <XCircle size={14} className="text-error" />;
    case "idle":
    case "pending":
    default:
      return <CircleDashed size={14} className="text-secondary" />;
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
  const deployHistory = useAppStore(state => state.deployHistory);
  const rollbackDeploy = useAppStore(state => state.rollbackDeploy);

  const [expandedDeploy, setExpandedDeploy] = useState<string | null>(null);

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
      className="flex flex-col bg-page border-t border-subtle shrink-0 relative"
      style={{ height: `${height}px` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1.5 -mt-[1px] cursor-row-resize z-10 hover:bg-accent/50 transition-colors"
        onMouseDown={onMouseDown}
      />

      <Tabs.Root defaultValue="terminal" className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-subtle bg-surface px-2">
          <Tabs.List className="flex">
            <Tabs.Trigger
              value="terminal"
              className="px-4 py-2 text-xs font-medium text-secondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-primary outline-none flex items-center gap-2 transition-colors"
            >
              <Terminal size={14} /> Terminal
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tasks"
              className="px-4 py-2 text-xs font-medium text-secondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-primary outline-none flex items-center gap-2 transition-colors"
            >
              <ListTree size={14} /> Task Tree
            </Tabs.Trigger>
            <Tabs.Trigger
              value="deploys"
              className="px-4 py-2 text-xs font-medium text-secondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-accent hover:text-primary outline-none flex items-center gap-2 transition-colors"
            >
              <Rocket size={14} /> Deploys
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

          <div className="flex items-center px-3 py-2 border-t border-subtle/50 bg-page shrink-0">
            <span className="text-info font-mono text-[13px] font-bold mr-2 select-none">
              {">_"}
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTerminalSubmit}
              placeholder="Send command to Executor..."
              className="flex-1 bg-transparent border-none outline-none text-[13px] font-mono text-primary placeholder:text-secondary/50"
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

        <Tabs.Content
          value="deploys"
          className="flex-1 min-h-0 outline-none bg-base"
        >
          <ScrollArea.Root className="h-full w-full">
            <ScrollArea.Viewport className="w-full h-full">
              <div className="p-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-secondary border-b border-subtle">
                      <th className="pb-2 font-medium px-2">Status</th>
                      <th className="pb-2 font-medium px-2">Target</th>
                      <th className="pb-2 font-medium px-2">Duration</th>
                      <th className="pb-2 font-medium px-2">Commit</th>
                      <th className="pb-2 font-medium px-2">Timestamp</th>
                      <th className="pb-2 font-medium px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle">
                    {deployHistory.map((deploy, index) => (
                      <React.Fragment key={deploy.id}>
                        <tr className={cn(
                          "group hover:bg-surface transition-colors",
                          deploy.status === 'error' ? "bg-error/5" : ""
                        )}>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {deploy.status === 'success' ? (
                                <CheckCircle2 size={14} className="text-success" />
                              ) : deploy.status === 'building' ? (
                                <CircleDashed size={14} className="text-warning animate-spin" />
                              ) : (
                                <XCircle size={14} className="text-error" />
                              )}
                              {index === 0 && deploy.status === 'success' && (
                                <span className="px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">LIVE</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex flex-col">
                              <span className="text-primary font-medium">{deploy.target}</span>
                              <span className="text-secondary text-[10px]">{deploy.environment}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-secondary font-mono">{deploy.duration}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1 text-secondary font-mono">
                              <Hash size={10} />
                              {deploy.commit}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-secondary">{deploy.timestamp}</td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {deploy.url && (
                                <a 
                                  href={deploy.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-secondary hover:text-primary rounded hover:bg-elevated transition-colors"
                                  title="Open URL"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                              <button 
                                onClick={() => setExpandedDeploy(expandedDeploy === deploy.id ? null : deploy.id)}
                                className={cn(
                                  "p-1.5 rounded transition-colors",
                                  expandedDeploy === deploy.id ? "bg-accent/20 text-accent" : "text-secondary hover:text-primary hover:bg-elevated"
                                )}
                                title="View Logs"
                              >
                                <Eye size={14} />
                              </button>
                              
                              <AlertDialog.Root>
                                <AlertDialog.Trigger asChild>
                                  <button 
                                    className="p-1.5 text-secondary hover:text-warning rounded hover:bg-elevated transition-colors"
                                    title="Rollback"
                                  >
                                    <RotateCcw size={14} />
                                  </button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                  <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
                                  <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-page border border-subtle rounded-xl p-6 shadow-2xl z-[101]">
                                    <AlertDialog.Title className="text-primary font-bold text-lg mb-2">Confirm Rollback</AlertDialog.Title>
                                    <AlertDialog.Description className="text-secondary text-sm mb-6">
                                      Are you sure you want to rollback to deployment <span className="text-primary font-mono">{deploy.commit}</span>? This will replace the current live version.
                                    </AlertDialog.Description>
                                    <div className="flex justify-end gap-3">
                                      <AlertDialog.Cancel asChild>
                                        <button className="px-4 py-2 text-secondary hover:text-primary font-medium transition-colors">Cancel</button>
                                      </AlertDialog.Cancel>
                                      <AlertDialog.Action asChild>
                                        <button 
                                          onClick={() => rollbackDeploy(deploy.id)}
                                          className="px-4 py-2 bg-warning hover:bg-warning/80 text-white font-bold rounded-lg transition-all"
                                        >
                                          Confirm Rollback
                                        </button>
                                      </AlertDialog.Action>
                                    </div>
                                  </AlertDialog.Content>
                                </AlertDialog.Portal>
                              </AlertDialog.Root>
                            </div>
                          </td>
                        </tr>
                        {expandedDeploy === deploy.id && (
                          <tr>
                            <td colSpan={6} className="bg-inset p-4 border-x border-b border-subtle">
                              <div className="font-mono text-[10px] leading-relaxed space-y-1">
                                {deploy.logs.map((log, i) => (
                                  <div key={i} className={cn(
                                    log.startsWith('→') ? "text-primary" : 
                                    log.startsWith('  ✓') || log.startsWith('✅') ? "text-success" :
                                    log.includes('error') ? "text-error" :
                                    "text-secondary"
                                  )}>
                                    {log}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
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
