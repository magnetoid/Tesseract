import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  Search, 
  Terminal, 
  Database, 
  Shield, 
  Puzzle, 
  Sparkles, 
  Settings, 
  FileCode, 
  Play, 
  Rocket, 
  Zap, 
  Plus, 
  Trash2, 
  Monitor,
  Moon,
  Sun,
  History
} from 'lucide-react';
import { useLayoutStore, TabType } from '../../stores/layoutStore';
import { useAppStore } from '../../useAppStore';
import { useEditorStore } from '../../stores/editorStore';
import { cn } from '../../lib/utils';

export function CommandPalette() {
  const { 
    commandPaletteOpen, 
    setCommandPalette, 
    openTab, 
    toggleLeftPanel, 
    toggleRightPanel,
    setRightPanelView
  } = useLayoutStore();
  const { files } = useAppStore();
  const { openFile } = useEditorStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPalette(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPalette]);

  const runAction = (action: () => void) => {
    action();
    setCommandPalette(false);
  };

  return (
    <Dialog.Root open={commandPaletteOpen} onOpenChange={setCommandPalette}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#141416] border border-[#232328] rounded-xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 duration-200">
          <Command className="flex flex-col h-full">
            <div className="flex items-center px-4 border-b border-[#232328]">
              <Search className="mr-3 text-[#44444d]" size={18} />
              <Command.Input 
                placeholder="Search files, tools, and actions..." 
                className="flex-1 h-12 bg-transparent text-sm text-[#e8e8ed] outline-none placeholder:text-[#44444d]"
              />
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
              <Command.Empty className="py-6 text-center text-sm text-[#6b6b7a]">No results found.</Command.Empty>

              <Command.Group heading="Tools" className="px-2 py-1.5 text-[10px] font-bold text-[#44444d] uppercase tracking-widest">
                <Item onSelect={() => runAction(() => openTab('preview'))} icon={<Play size={14} />} label="Open Preview" />
                <Item onSelect={() => runAction(() => openTab('terminal'))} icon={<Terminal size={14} />} label="Open Terminal" />
                <Item onSelect={() => runAction(() => openTab('database'))} icon={<Database size={14} />} label="Open Database" />
                <Item onSelect={() => runAction(() => openTab('security'))} icon={<Shield size={14} />} label="Open Security Scan" />
                <Item onSelect={() => runAction(() => openTab('integrations'))} icon={<Puzzle size={14} />} label="Open Integrations" />
                <Item onSelect={() => runAction(() => openTab('skills'))} icon={<Sparkles size={14} />} label="Open Agent Skills" />
                <Item onSelect={() => runAction(() => openTab('settings'))} icon={<Settings size={14} />} label="Open Settings" />
              </Command.Group>

              <Command.Group heading="Files" className="px-2 py-1.5 text-[10px] font-bold text-[#44444d] uppercase tracking-widest mt-2">
                {files.map(file => (
                  <Item 
                    key={file.id} 
                    onSelect={() => runAction(() => openFile(file.id))} 
                    icon={<FileCode size={14} />} 
                    label={file.name} 
                    shortcut={file.extension}
                  />
                ))}
              </Command.Group>

              <Command.Group heading="Actions" className="px-2 py-1.5 text-[10px] font-bold text-[#44444d] uppercase tracking-widest mt-2">
                <Item onSelect={() => runAction(() => {})} icon={<Rocket size={14} />} label="Run Project" shortcut="⌘⇧↵" />
                <Item onSelect={() => runAction(() => {})} icon={<Zap size={14} />} label="Deploy to Production" />
                <Item onSelect={() => runAction(() => toggleLeftPanel())} icon={<Monitor size={14} />} label="Toggle Chat Panel" shortcut="⌘B" />
                <Item onSelect={() => runAction(() => toggleRightPanel())} icon={<Monitor size={14} />} label="Toggle File Tree" shortcut="⌘⇧B" />
                <Item onSelect={() => runAction(() => setRightPanelView('search'))} icon={<Search size={14} />} label="Global Search" shortcut="⌘⇧F" />
              </Command.Group>

              <Command.Group heading="Agent" className="px-2 py-1.5 text-[10px] font-bold text-[#44444d] uppercase tracking-widest mt-2">
                <Item onSelect={() => runAction(() => {})} icon={<Plus size={14} />} label="New Chat Session" />
                <Item onSelect={() => runAction(() => {})} icon={<Trash2 size={14} />} label="Clear Agent Context" />
                <Item onSelect={() => runAction(() => {})} icon={<Zap size={14} />} label="Switch to Turbo Mode" />
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Item({ icon, label, shortcut, onSelect }: { icon: React.ReactNode, label: string, shortcut?: string, onSelect: () => void }) {
  return (
    <Command.Item 
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#e8e8ed] hover:bg-violet-500/10 hover:text-violet-400 cursor-pointer transition-colors aria-selected:bg-violet-500/10 aria-selected:text-violet-400 outline-none"
    >
      <span className="text-[#6b6b7a] group-hover:text-violet-400">{icon}</span>
      <span className="flex-1">{label}</span>
      {shortcut && <span className="text-[10px] text-[#44444d] font-mono">{shortcut}</span>}
    </Command.Item>
  );
}
