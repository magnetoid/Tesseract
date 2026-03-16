import React, { useState } from 'react';
import TopBar from './TopBar';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import IDEShell from './IDEShell';
import ModelConfigDialog from './ModelConfigDialog';
import { useMode } from './useAgentStore';
import { cn } from './utils';

export default function ArrayIDE() {
  const mode = useMode();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-base text-text-primary overflow-hidden font-sans">
      <TopBar onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Builder Mode Layout */}
        <div 
          className={cn(
            "absolute inset-0 flex transition-all duration-300 ease-in-out",
            mode === 'builder' 
              ? "opacity-100 pointer-events-auto scale-100 translate-y-0 delay-100" 
              : "opacity-0 pointer-events-none scale-[0.98] translate-y-2"
          )}
        >
          <ChatPanel />
          <PreviewPanel />
        </div>

        {/* IDE Mode Layout */}
        <div 
          className={cn(
            "absolute inset-0 flex transition-all duration-300 ease-in-out",
            mode === 'ide' 
              ? "opacity-100 pointer-events-auto scale-100 translate-y-0 delay-100" 
              : "opacity-0 pointer-events-none scale-[0.98] translate-y-2"
          )}
        >
          <IDEShell />
        </div>
      </div>

      <ModelConfigDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
