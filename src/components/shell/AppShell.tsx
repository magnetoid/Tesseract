import React, { useEffect, useState } from 'react';
import { TopBar } from './TopBar';
import { Rail } from './Rail';
import { LeftPanel } from './LeftPanel';
import { CenterWorkArea } from './CenterWorkArea';
import { RightPanel } from './RightPanel';
import { useLayoutStore } from '../../stores/layoutStore';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { CommandPalette } from '../shared/CommandPalette';
import { ToastProvider, useToast } from '../shared/ToastProvider';
import { cn } from '../../lib/utils';

export function AppShell() {
  const { 
    toggleLeftPanel, 
    toggleRightPanel, 
    leftPanelOpen, 
    rightPanelOpen,
    centerTabs,
    activeTabId,
    setActiveTab,
    closeTab,
    openTab,
    setRightPanelView,
    setCommandPalette
  } = useLayoutStore();

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useKeyboardShortcut({
    'cmd+b': () => toggleLeftPanel(),
    'cmd+shift+b': () => toggleRightPanel(),
    'cmd+w': () => activeTabId && closeTab(activeTabId),
    'cmd+t': () => openTab('preview'), // Default to preview for now
    'cmd+k': () => setCommandPalette(true),
    'cmd+`': () => openTab('terminal'),
    'cmd+shift+f': () => setRightPanelView('search'),
    'cmd+digit': (e) => {
      const index = parseInt(e.key) - 1;
      if (centerTabs[index]) setActiveTab(centerTabs[index].id);
    }
  });

  return (
    <ToastProvider>
      <div className="flex flex-col h-screen bg-[#0a0a0c] text-[#e8e8ed] font-sans overflow-hidden">
        <TopBar />
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          <Rail className={cn(isMobile && "fixed bottom-0 left-0 right-0 h-12 w-full flex-row z-50 bg-[#141416] border-t border-[#232328]")} />
          
          {/* Left Panel Overlay on Tablet */}
          {isTablet && leftPanelOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 transition-opacity" 
              onClick={toggleLeftPanel}
            />
          )}
          
          <div className={cn(
            "transition-all duration-300 flex flex-1 min-w-0 overflow-hidden",
            isTablet && leftPanelOpen ? "translate-x-0" : isTablet ? "-translate-x-0" : ""
          )}>
            <LeftPanel className={cn(
              isTablet && "fixed top-10 bottom-0 left-9 w-[320px] z-40 shadow-2xl transition-transform duration-300",
              isTablet && !leftPanelOpen && "-translate-x-full"
            )} />
            
            <CenterWorkArea />
            
            {!isMobile && (
              <RightPanel className={cn(
                isTablet && "fixed top-10 bottom-0 right-0 w-[260px] z-40 shadow-2xl transition-transform duration-300",
                isTablet && !rightPanelOpen && "translate-x-full"
              )} />
            )}
          </div>
        </div>
        <CommandPalette />
      </div>
    </ToastProvider>
  );
}
