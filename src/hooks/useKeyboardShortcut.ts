import { useEffect } from 'react';

type KeyCombo = string;

export function useKeyboardShortcut(shortcuts: Record<KeyCombo, (e: KeyboardEvent) => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmd = event.metaKey || event.ctrlKey;
      const isShift = event.shiftKey;
      const key = event.key.toLowerCase();
      
      let combo = '';
      if (isCmd) combo += 'cmd+';
      if (isShift) combo += 'shift+';
      combo += key;

      // Handle specific cases like Cmd+Shift+B vs Cmd+B
      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo](event);
      } else if (isCmd && !isShift && /^[1-9]$/.test(key)) {
        // Handle Cmd+1 through Cmd+9
        if (shortcuts['cmd+digit']) {
          event.preventDefault();
          shortcuts['cmd+digit'](event);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
