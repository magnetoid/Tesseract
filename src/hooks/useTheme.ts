import { useEffect } from 'react';
import { useThemeStore } from '../lib/theme';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Keyboard shortcut Cmd+Shift+L (or Ctrl+Shift+L)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toUpperCase() === 'L') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  return { theme, toggleTheme };
};
