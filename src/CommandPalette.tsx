import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, Terminal, FileCode2, Settings, Play, MessageSquare, Code2 } from 'lucide-react';
import { useAppStore } from './useAppStore';

const COMMANDS = [
  { id: 'run', label: 'Run / Build Project', icon: Play, shortcut: '⌘ Enter' },
  { id: 'mode-builder', label: 'Switch to Builder Mode', icon: MessageSquare, shortcut: '⌘ B' },
  { id: 'mode-ide', label: 'Switch to IDE Mode', icon: Code2, shortcut: '⌘ B' },
  { id: 'settings', label: 'Open Settings', icon: Settings, shortcut: '⌘ ,' },
  { id: 'new-file', label: 'Create New File', icon: FileCode2 },
  { id: 'terminal', label: 'Toggle Terminal', icon: Terminal },
];

export default function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const mode = useAppStore(state => state.mode);
  const setMode = useAppStore(state => state.setMode);
  const simulateBuilderFlow = useAppStore(state => state.simulateBuilderFlow);

  const filteredCommands = COMMANDS.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase()) &&
    !(c.id === 'mode-builder' && mode === 'builder') &&
    !(c.id === 'mode-ide' && mode === 'ide')
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const executeCommand = (id: string) => {
    switch (id) {
      case 'run':
        simulateBuilderFlow("Build a multi-agent IDE with React and Tailwind");
        break;
      case 'mode-builder':
        setMode('builder');
        break;
      case 'mode-ide':
        setMode('ide');
        break;
      case 'settings':
        // This would trigger the settings dialog in a real app
        break;
    }
    onOpenChange(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex].id);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content 
          className="fixed left-[50%] top-[20%] z-[100] w-full max-w-xl translate-x-[-50%] gap-4 border border-[#2a2a30] bg-[#141416] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 sm:rounded-xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center px-4 py-3 border-b border-[#2a2a30]">
            <Search size={18} className="text-[#6b6b7a] mr-3" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent border-none outline-none text-[#e8e8ed] placeholder:text-[#6b6b7a] text-sm"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-[#1c1c20] border border-[#2a2a30] rounded px-1.5 py-0.5 text-[10px] text-[#6b6b7a] font-mono shadow-sm ml-2">
              ESC
            </kbd>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#6b6b7a]">
                No commands found.
              </div>
            ) : (
              filteredCommands.map((cmd, i) => {
                const Icon = cmd.icon;
                const isSelected = i === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd.id)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                      isSelected ? 'bg-violet-500/20 text-violet-300' : 'text-[#e8e8ed] hover:bg-[#1c1c20]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isSelected ? 'text-violet-400' : 'text-[#6b6b7a]'} />
                      <span>{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <span className={`text-xs font-mono ${isSelected ? 'text-violet-400/70' : 'text-[#6b6b7a]'}`}>
                        {cmd.shortcut}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
