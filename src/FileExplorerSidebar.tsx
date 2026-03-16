import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight, ChevronDown, FileCode, FileJson, Folder } from 'lucide-react';

export default function FileExplorerSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full h-full bg-base border-r border-border-dim flex flex-col shrink-0">
      <div className="h-10 px-4 flex items-center text-xs font-semibold text-text-muted tracking-wider">
        EXPLORER
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
          <Collapsible.Trigger className="flex items-center gap-1 w-full px-2 py-1 hover:bg-surface rounded text-sm text-text-primary outline-none">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={14} className="text-accent" />
            <span>src</span>
          </Collapsible.Trigger>
          <Collapsible.Content className="pl-6 pr-2 py-1 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-surface rounded text-sm text-text-muted cursor-pointer">
              <FileCode size={14} className="text-blue-400" />
              <span>App.tsx</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-surface rounded text-sm text-text-primary cursor-pointer">
              <FileCode size={14} className="text-blue-400" />
              <span>index.tsx</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-surface rounded text-sm text-text-muted cursor-pointer">
              <FileJson size={14} className="text-yellow-400" />
              <span>package.json</span>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
}
