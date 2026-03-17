import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  MessageSquare, 
  Code2, 
  Play, 
  Terminal, 
  Database, 
  Shield, 
  Puzzle, 
  Sparkles, 
  Plus, 
  Moon, 
  Sun, 
  Settings,
  LucideIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLayoutStore, TabType } from '../../stores/layoutStore';

interface RailIconProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const RailIcon = ({ icon: Icon, label, active, onClick, className }: RailIconProps) => (
  <Tooltip.Provider delayDuration={200}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 group",
            active 
              ? "bg-violet-500/15 text-violet-400" 
              : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]",
            className
          )}
        >
          <Icon size={16} className={cn("transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content 
          className="bg-[#1c1c20] text-[#e8e8ed] text-[10px] px-2 py-1 rounded border border-[#232328] shadow-xl z-[100]" 
          side="right" 
          sideOffset={8}
        >
          {label}
          <Tooltip.Arrow className="fill-[#232328]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export function Rail({ className }: { className?: string }) {
  const { 
    leftPanelOpen, 
    toggleLeftPanel, 
    openTab, 
    centerTabs, 
    activeTabId 
  } = useLayoutStore();

  const activeTab = centerTabs.find(t => t.id === activeTabId);

  const tools: { type: TabType; icon: LucideIcon; label: string }[] = [
    { type: 'code', icon: Code2, label: 'Code Editor' },
    { type: 'preview', icon: Play, label: 'Preview' },
    { type: 'terminal', icon: Terminal, label: 'Terminal' },
    { type: 'database', icon: Database, label: 'Database' },
    { type: 'security', icon: Shield, label: 'Security Scan' },
    { type: 'integrations', icon: Puzzle, label: 'Integrations' },
    { type: 'skills', icon: Sparkles, label: 'Agent Skills' },
  ];

  return (
    <aside className={cn("w-9 bg-[#141416] border-r border-[#232328] flex flex-col items-center py-2 gap-1 shrink-0 z-40", className)}>
      <RailIcon 
        icon={MessageSquare} 
        label="Agent Chat" 
        active={leftPanelOpen} 
        onClick={toggleLeftPanel} 
      />
      
      <div className="w-5 h-[1px] bg-[#232328] my-1" />

      {tools.map((tool) => (
        <RailIcon 
          key={tool.type}
          icon={tool.icon} 
          label={tool.label} 
          active={activeTab?.type === tool.type} 
          onClick={() => openTab(tool.type)} 
        />
      ))}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] transition-all">
            <Plus size={16} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-[#1c1c20] border border-[#232328] rounded-md p-1 shadow-xl z-50 min-w-[120px]">
            <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
              <Plus size={12} /> Add Tool
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <div className="mt-auto flex flex-col items-center gap-1">
        <RailIcon icon={Moon} label="Toggle Theme" />
        <RailIcon 
          icon={Settings} 
          label="Settings" 
          active={activeTab?.type === 'settings'} 
          onClick={() => openTab('settings')} 
        />
      </div>
    </aside>
  );
}
