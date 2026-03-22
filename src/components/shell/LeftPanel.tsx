import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '../../stores/layoutStore';
import { cn } from '../../lib/utils';
import ChatPanel from '../../ChatPanel'; // Assuming ChatPanel exists at this path

export function LeftPanel({ className }: { className?: string }) {
  const { leftPanelOpen } = useLayoutStore();

  return (
    <AnimatePresence initial={false}>
      {leftPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn("bg-page border-r border-default flex flex-col overflow-hidden shrink-0", className)}
        >
          <div className="w-[380px] h-full flex flex-col">
            <ChatPanel />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
