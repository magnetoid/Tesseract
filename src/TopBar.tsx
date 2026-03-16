import React, { useState, useRef, useEffect } from 'react';
import * as Separator from '@radix-ui/react-separator';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { MessageSquare, Code2, Settings, Play, Loader2 } from 'lucide-react';
import { 
  useAgents, 
  useMode, 
  useAppStore,
  AgentStatus
} from './useAppStore';

const getStatusColor = (status: AgentStatus) => {
  switch (status) {
    case 'idle': return 'bg-gray-500';
    case 'thinking': return 'bg-amber-500 animate-pulse';
    case 'running': return 'bg-violet-500 animate-pulse';
    case 'done': return 'bg-emerald-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const mode = useMode();
  const setMode = useAppStore(state => state.setMode);
  const agents = useAgents();
  const simulateBuilderFlow = useAppStore(state => state.simulateBuilderFlow);
  
  const isRunning = agents.some(a => a.status === 'running' || a.status === 'thinking');

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('Untitled Project');
  const inputRef = useRef<HTMLInputElement>(null);

  // Add a local state for the loading spinner during mode transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeChange = (newMode: 'builder' | 'ide') => {
    if (!newMode || newMode === mode) return;
    setIsTransitioning(true);
    // Simulate a short loading state for the transition
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    if (!tempName.trim()) {
      setTempName('Untitled Project');
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };

  const handleRun = () => {
    if (!isRunning) {
      simulateBuilderFlow("Build a multi-agent IDE with React and Tailwind");
    }
  };

  return (
    <div className="h-12 shrink-0 flex items-center justify-between bg-[#141416] border-b border-[#2a2a30] px-4 relative z-50">
      
      {/* Left Section */}
      <div className="flex items-center">
        {/* Logo */}
        <div className="relative w-5 h-5 mr-3 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-violet-500">
            <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="8" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Project Name */}
        {isEditingName ? (
          <div className="flex items-center">
            <VisuallyHidden.Root>
              <label htmlFor="project-name-input">Project Name</label>
            </VisuallyHidden.Root>
            <input
              id="project-name-input"
              ref={inputRef}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              className="bg-[#1c1c20] border border-violet-500/50 outline-none text-sm font-semibold text-[#e8e8ed] px-2 py-0.5 rounded w-40 focus:ring-1 focus:ring-violet-500"
            />
          </div>
        ) : (
          <button 
            onClick={() => setIsEditingName(true)}
            className="text-sm font-semibold text-[#e8e8ed] hover:bg-[#1c1c20] px-2 py-0.5 rounded transition-colors truncate max-w-[200px]"
          >
            {tempName}
          </button>
        )}

        <Separator.Root orientation="vertical" className="h-4 w-[1px] bg-[#2a2a30] mx-3" />
      </div>

      {/* Center Section (Absolute Centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ToggleGroup.Root 
          type="single" 
          value={mode} 
          onValueChange={handleModeChange}
          className="flex bg-[#0d0d0f] rounded-md p-0.5 border border-[#2a2a30]"
        >
          <ToggleGroup.Item 
            value="builder" 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm outline-none transition-all data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-400 text-[#6b6b7a] hover:text-[#e8e8ed] data-[state=on]:hover:text-violet-300 relative"
          >
            {isTransitioning && mode === 'ide' ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
            Builder
          </ToggleGroup.Item>
          <ToggleGroup.Item 
            value="ide" 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm outline-none transition-all data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-400 text-[#6b6b7a] hover:text-[#e8e8ed] data-[state=on]:hover:text-violet-300 relative"
          >
            {isTransitioning && mode === 'builder' ? <Loader2 size={14} className="animate-spin" /> : <Code2 size={14} />}
            IDE
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Agent Status Dots */}
        <div className="flex items-center gap-1.5">
          <Tooltip.Provider delayDuration={200}>
            {agents.map(agent => (
              <Tooltip.Root key={agent.id}>
                <Tooltip.Trigger asChild>
                  <div className={`w-2 h-2 rounded-full cursor-default ${getStatusColor(agent.status)}`} />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content 
                    className="bg-[#1c1c20] text-[#e8e8ed] text-xs px-2 py-1 rounded border border-[#2a2a30] shadow-xl z-50 flex items-center gap-2" 
                    sideOffset={5}
                  >
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-[#6b6b7a] uppercase text-[10px] tracking-wider">· {agent.status}</span>
                    <Tooltip.Arrow className="fill-[#2a2a30]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </Tooltip.Provider>
        </div>

        <Separator.Root orientation="vertical" className="h-4 w-[1px] bg-[#2a2a30] mx-1" />

        {/* Run Button */}
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors"
        >
          {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </button>

        {/* Settings Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-colors outline-none">
              <Settings size={16} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end" 
              sideOffset={8}
              className="min-w-[180px] bg-[#1c1c20] border border-[#2a2a30] rounded-md p-1 shadow-xl z-50 text-sm text-[#e8e8ed]"
            >
              <DropdownMenu.Item 
                onSelect={onOpenSettings}
                className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors"
              >
                Model Config
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors">
                Keyboard Shortcuts
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors">
                Theme
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
              <DropdownMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors">
                About ArrayIDE
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
