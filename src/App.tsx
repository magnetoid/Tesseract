import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as Toast from '@radix-ui/react-toast';
import TopBar from './TopBar';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import IDEShell from './IDEShell';
import ModelConfigDialog from './ModelConfigDialog';
import CommandPalette from './CommandPalette';
import { useAppStore } from './useAppStore';

export default function App() {
  const mode = useAppStore(state => state.mode);
  const setMode = useAppStore(state => state.setMode);
  const simulateBuilderFlow = useAppStore(state => state.simulateBuilderFlow);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle mode switch toast
  useEffect(() => {
    if (mode === 'ide') {
      setToastMessage('Switched to IDE mode');
      setToastOpen(true);
    } else if (mode === 'builder') {
      setToastMessage('Switched to Builder mode');
      setToastOpen(true);
    }
  }, [mode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+B: toggle mode
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setMode(mode === 'builder' ? 'ide' : 'builder');
      }
      // Cmd+Enter: run/build
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        simulateBuilderFlow("Build a multi-agent IDE with React and Tailwind");
      }
      // Cmd+,: open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
      // Cmd+K: open command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      // Escape: close dialogs
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, setMode, simulateBuilderFlow]);

  return (
    <Toast.Provider swipeDirection="right">
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0d0d0f] font-sans text-[#e8e8ed]">
        <TopBar onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            {mode === 'builder' ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="absolute inset-0 flex"
              >
                <ChatPanel />
                <PreviewPanel />
              </motion.div>
            ) : (
              <motion.div
                key="ide"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="absolute inset-0 flex"
              >
                <IDEShell />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ModelConfigDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

        {/* Toast Notification */}
        <Toast.Root 
          open={toastOpen} 
          onOpenChange={setToastOpen}
          duration={2000}
          className="bg-[#1c1c20] border border-[#2a2a30] text-[#e8e8ed] rounded-md shadow-lg px-4 py-3 flex items-center gap-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-0"
        >
          <Toast.Title className="text-sm font-medium">
            {toastMessage}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-6 w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
      </div>
    </Toast.Provider>
  );
}
