import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type ConnectionState = 'connected' | 'reconnecting' | 'offline';

export const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<ConnectionState>('connected');
  const [showBanner, setShowBanner] = useState(false);

  // Mock connection state changes for demonstration
  useEffect(() => {
    const handleOnline = () => {
      setStatus('connected');
      setShowBanner(false);
    };
    const handleOffline = () => {
      setStatus('offline');
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-success';
      case 'reconnecting': return 'bg-warning animate-pulse';
      case 'offline': return 'bg-error';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'reconnecting': return 'Reconnecting...';
      case 'offline': return 'Offline';
    }
  };

  return (
    <>
      {/* Tiny dot for TopBar/StatusBar */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-elevated transition-colors group cursor-help">
        <div className={cn("w-2 h-2 rounded-full shadow-sm", getStatusColor())} />
        <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider group-hover:text-secondary transition-colors">
          {getStatusLabel()}
        </span>
      </div>

      {/* Offline Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-error text-white overflow-hidden shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff size={16} />
                <p className="text-xs font-bold tracking-tight">
                  You're offline. Changes will sync when reconnected.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
                <button 
                  onClick={() => setShowBanner(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
