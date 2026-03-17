import React, { useState, useEffect, useRef } from 'react';
import * as Separator from '@radix-ui/react-separator';
import * as Tooltip from '@radix-ui/react-tooltip';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Pencil, 
  Play,
  Loader2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Terminal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../useAppStore';
import { useLayoutStore } from '../../stores/layoutStore';

export default function PreviewTab() {
  const { buildStatus, previewUrl, triggerBuild } = useAppStore();
  const { openTab } = useLayoutStore();
  
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{ type: 'log' | 'error' | 'warn'; text: string; timestamp: number }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Mock console logs
  useEffect(() => {
    if (buildStatus === 'success') {
      const logs = [
        { type: 'log', text: '[vite] connecting...', timestamp: Date.now() },
        { type: 'log', text: '[vite] connected.', timestamp: Date.now() + 100 },
        { type: 'log', text: 'App initialized.', timestamp: Date.now() + 500 },
      ];
      setConsoleLogs(logs as any);
    }
  }, [buildStatus]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(previewUrl);
    // In a real app, show a toast here
  };

  const renderContent = () => {
    if (buildStatus === 'idle') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <Monitor size={48} className="text-[#44444d] mb-4" />
          <h3 className="text-base font-medium text-[#e8e8ed]">Your app is not running</h3>
          <div className="flex items-center gap-2 mt-4">
            <button 
              onClick={triggerBuild}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Play size={14} fill="currentColor" />
              Run
            </button>
            <span className="text-sm text-[#6b6b7a]">to preview your app.</span>
          </div>
        </div>
      );
    }

    if (buildStatus === 'building') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <Loader2 size={32} className="text-violet-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-violet-500 rounded-full animate-ping" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#6b6b7a]">
            <span>Starting dev server</span>
            <span className="flex gap-0.5">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </div>
        </div>
      );
    }

    if (buildStatus === 'error') {
      return (
        <div className="flex-1 flex flex-col">
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Build Failed</span>
            <span className="text-xs text-red-400/80 truncate">Module not found: Can't resolve './components/AuthLanding'</span>
          </div>
          <div className="flex-1 opacity-40 pointer-events-none grayscale">
             {/* Show last successful or empty */}
             <div className="w-full h-full flex items-center justify-center">
                <Monitor size={48} className="text-[#232328]" />
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div 
          className={cn(
            "bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out",
            viewport === 'desktop' ? "w-full h-full" : 
            viewport === 'tablet' ? "w-[768px] h-[1024px] max-h-full" : 
            "w-[375px] h-[667px] max-h-full"
          )}
        >
          <iframe 
            ref={iframeRef}
            src={previewUrl} 
            className="w-full h-full border-none"
            title="App Preview"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] overflow-hidden">
      {/* TOOLBAR */}
      <header className="h-9 bg-[#141416] border-b border-[#232328] flex items-center px-2 gap-1 shrink-0 z-10">
        <div className="bg-[#1c1c20] rounded-full px-2 py-0.5 text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider cursor-not-allowed opacity-50">
          Canvas
        </div>
        
        <Separator.Root orientation="vertical" className="w-[1px] h-4 bg-[#232328] mx-1" />
        
        <div className="flex items-center gap-0.5">
          <button disabled className="p-1 text-[#44444d] cursor-not-allowed">
            <ArrowLeft size={14} />
          </button>
          <button disabled className="p-1 text-[#44444d] cursor-not-allowed">
            <ArrowRight size={14} />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors"
          >
            <RotateCw size={14} />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-[#1c1c20] rounded-full px-3 py-1 gap-2 border border-[#232328]/50">
          <span className="text-[10px] text-[#44444d] font-mono">localhost:3000 /</span>
          <input 
            type="text" 
            readOnly 
            value="" 
            className="bg-transparent text-[10px] text-[#6b6b7a] outline-none w-full"
          />
        </div>

        <Separator.Root orientation="vertical" className="w-[1px] h-4 bg-[#232328] mx-1" />

        <div className="flex items-center gap-1">
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={() => openTab('code')}
                  className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors"
                >
                  <Pencil size={14} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-[10px] px-2 py-1 rounded border border-[#232328] shadow-xl" sideOffset={5}>
                  Edit Page
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={handleCopyUrl}
                  className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors"
                >
                  <Copy size={14} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-[10px] px-2 py-1 rounded border border-[#232328] shadow-xl" sideOffset={5}>
                  Copy URL
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-[10px] px-2 py-1 rounded border border-[#232328] shadow-xl" sideOffset={5}>
                  Open in New Tab
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <Separator.Root orientation="vertical" className="w-[1px] h-4 bg-[#232328] mx-1" />

        <div className="flex items-center bg-[#0a0a0c] rounded-md p-0.5 border border-[#232328]">
          <button 
            onClick={() => setViewport('desktop')}
            className={cn("p-1 rounded transition-all", viewport === 'desktop' ? "bg-violet-500 text-white" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}
          >
            <Monitor size={12} />
          </button>
          <button 
            onClick={() => setViewport('tablet')}
            className={cn("p-1 rounded transition-all", viewport === 'tablet' ? "bg-violet-500 text-white" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}
          >
            <Tablet size={12} />
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            className={cn("p-1 rounded transition-all", viewport === 'mobile' ? "bg-violet-500 text-white" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}
          >
            <Smartphone size={12} />
          </button>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {renderContent()}
      </div>

      {/* CONSOLE DRAWER */}
      <div className={cn(
        "bg-[#0a0a0c] border-t border-[#232328] transition-all duration-300 ease-in-out flex flex-col shrink-0",
        isConsoleOpen ? "h-[120px]" : "h-6"
      )}>
        <button 
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
          className="h-6 px-3 flex items-center justify-between hover:bg-[#141416] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Terminal size={10} className={cn("transition-colors", isConsoleOpen ? "text-violet-400" : "text-[#6b6b7a]")} />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", isConsoleOpen ? "text-[#e8e8ed]" : "text-[#6b6b7a]")}>Console</span>
            {consoleLogs.length > 0 && !isConsoleOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {isConsoleOpen && (
              <button 
                onClick={(e) => { e.stopPropagation(); setConsoleLogs([]); }}
                className="p-1 text-[#6b6b7a] hover:text-red-400 transition-colors"
              >
                <Trash2 size={10} />
              </button>
            )}
            {isConsoleOpen ? <ChevronDown size={12} className="text-[#6b6b7a]" /> : <ChevronUp size={12} className="text-[#6b6b7a]" />}
          </div>
        </button>
        
        {isConsoleOpen && (
          <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px] space-y-1 bg-[#050505]">
            {consoleLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#44444d] italic">
                No logs to display
              </div>
            ) : (
              consoleLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 border-b border-[#232328]/30 pb-1">
                  <span className="text-[#44444d] shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <span className={cn(
                    log.type === 'error' ? "text-red-400" : log.type === 'warn' ? "text-amber-400" : "text-[#e8e8ed]"
                  )}>
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
