import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Reorder, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Play, 
  Code2, 
  Terminal, 
  Database, 
  Shield, 
  Puzzle, 
  Sparkles, 
  Settings,
  Split,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLayoutStore, Tab, TabType, TAB_CONFIG } from '../../stores/layoutStore';

export function TabBar() {
  const { 
    centerTabs, 
    activeTabId, 
    setActiveTab, 
    closeTab, 
    openTab, 
    reorderTabs,
    setSecondaryTab,
    setSplit,
    secondaryTabId
  } = useLayoutStore();

  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  const handleSplit = (tabId: string, direction: 'vertical' | 'horizontal') => {
    setSecondaryTab(tabId);
    setSplit(direction);
  };

  return (
    <div className="h-9 bg-[#141416] border-b border-[#232328] flex items-center overflow-x-auto no-scrollbar shrink-0">
      <Reorder.Group 
        axis="x" 
        values={centerTabs} 
        onReorder={reorderTabs}
        className="flex items-center h-full"
      >
        <AnimatePresence initial={false}>
          {centerTabs.map((tab) => {
            const Icon = TAB_CONFIG[tab.type].icon;
            return (
              <Reorder.Item
                key={tab.id}
                value={tab}
                id={tab.id}
                onDragStart={() => setDraggedTabId(tab.id)}
                onDragEnd={() => setDraggedTabId(null)}
                className="h-full"
              >
                <ContextMenu.Root>
                  <ContextMenu.Trigger asChild>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "h-full px-3 flex items-center gap-2 text-xs font-medium transition-all border-r border-[#232328] relative group shrink-0 outline-none",
                        activeTabId === tab.id 
                          ? "bg-[#0a0a0c] text-[#e8e8ed]" 
                          : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]",
                        draggedTabId === tab.id && "opacity-50 scale-95 z-50 bg-violet-500/10"
                      )}
                    >
                      {activeTabId === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
                      )}
                      <Icon size={14} className={cn(activeTabId === tab.id ? "text-violet-400" : "text-[#6b6b7a]")} />
                      <span>{tab.label}</span>
                      {tab.closable && (
                        <div 
                          onClick={(e) => handleClose(e, tab.id)}
                          className="p-0.5 rounded-sm hover:bg-[#232328] opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                        >
                          <X size={12} />
                        </div>
                      )}
                    </button>
                  </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Content className="bg-[#1c1c20] border border-[#232328] rounded-md p-1 shadow-xl z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-100">
                      <ContextMenu.Item 
                        onClick={() => handleSplit(tab.id, 'vertical')}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
                      >
                        <Split size={14} className="rotate-90" />
                        Split Down
                      </ContextMenu.Item>
                      <ContextMenu.Item 
                        onClick={() => handleSplit(tab.id, 'horizontal')}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
                      >
                        <Split size={14} />
                        Split Right
                      </ContextMenu.Item>
                      <ContextMenu.Separator className="h-[1px] bg-[#232328] my-1" />
                      <ContextMenu.Item 
                        onClick={() => closeTab(tab.id)}
                        disabled={!tab.closable}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] hover:bg-red-500 rounded cursor-pointer outline-none disabled:opacity-30"
                      >
                        <X size={14} />
                        Close Tab
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Portal>
                </ContextMenu.Root>
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="h-full px-3 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] transition-all border-r border-[#232328]">
            <Plus size={16} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-[#1c1c20] border border-[#232328] rounded-md p-1 shadow-xl z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-100">
            {[
              { type: 'preview', label: 'Preview', icon: Play },
              { type: 'code', label: 'Code Editor', icon: Code2 },
              { type: 'terminal', label: 'Terminal', icon: Terminal },
              { type: 'database', label: 'Database', icon: Database },
              { type: 'security', label: 'Security Scan', icon: Shield },
              { type: 'integrations', label: 'Integrations', icon: Puzzle },
              { type: 'skills', label: 'Agent Skills', icon: Sparkles },
              { type: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <DropdownMenu.Item 
                key={item.type}
                onClick={() => openTab(item.type as TabType)}
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
              >
                <item.icon size={14} />
                {item.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
