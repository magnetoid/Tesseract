import React, { useState, useEffect } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Separator from '@radix-ui/react-separator';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Popover from '@radix-ui/react-popover';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Loader2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  Code2, 
  Code,
  Sparkles,
  Camera,
  QrCode,
  Terminal as TerminalIcon,
  X
} from 'lucide-react';
import { useAppStore } from './useAppStore';
import { cn } from './lib/utils';
import { toast } from 'sonner';

export default function PreviewPanel() {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewSource, setViewSource] = useState(false);
  const [url, setUrl] = useState('localhost:3000');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  const agents = useAppStore(state => state.agents);
  const messages = useAppStore(state => state.messages);
  const buildStatus = useAppStore(state => state.buildStatus);
  const buildTime = useAppStore(state => state.buildTime);
  const filesGenerated = useAppStore(state => state.filesGenerated);
  const totalTokens = useAppStore(state => state.totalTokens);
  const files = useAppStore(state => state.files);
  
  // Find active agent
  const activeAgent = agents.find(a => a.status === 'running' || a.status === 'thinking') || agents[0];
  const isBuilding = buildStatus === 'building';
  const hasMessages = messages.length > 0;

  // Get App.tsx content for view source
  const appFile = files.find(f => f.name === 'App.tsx');
  const sourceCode = appFile?.content || '// No source code available';

  return (
    <div className="flex-1 h-full flex flex-col min-w-0">
      {/* SECTION 1 — Browser toolbar */}
      <div className="h-10 bg-[#141416] border-b border-[#2a2a30] flex items-center px-3 gap-2 shrink-0">
        {/* macOS dots */}
        <div className="flex gap-1.5 items-center">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        <Separator.Root className="w-[1px] h-4 bg-[#2a2a30] mx-2" />

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button className="p-1 text-[#6b6b7a] opacity-50 cursor-not-allowed">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 text-[#6b6b7a] opacity-50 cursor-not-allowed">
            <ChevronRight size={16} />
          </button>
          <button className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
            {isBuilding ? <Loader2 size={14} className="animate-spin" /> : <RotateCw size={14} />}
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-grow flex items-center mx-2 max-w-xl">
          {isEditingUrl ? (
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setIsEditingUrl(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingUrl(false)}
              autoFocus
              className="w-full bg-[#1c1c20] rounded-full px-4 py-1 text-sm text-[#e8e8ed] outline-none border border-[#2a2a30] focus:border-violet-500/50"
            />
          ) : (
            <div 
              onClick={() => setIsEditingUrl(true)}
              className="w-full bg-[#1c1c20] rounded-full px-4 py-1 text-sm text-[#6b6b7a] cursor-text hover:bg-[#222226] transition-colors truncate"
            >
              {url}
            </div>
          )}
        </div>

        <Separator.Root className="w-[1px] h-4 bg-[#2a2a30] mx-2" />

        {/* Viewport Toggle */}
        <ToggleGroup.Root 
          type="single" 
          value={viewport} 
          onValueChange={(v) => v && setViewport(v as any)}
          className="flex items-center gap-1"
        >
          <ToggleGroup.Item value="desktop" className={cn("p-1.5 rounded transition-colors", viewport === 'desktop' ? "bg-[#2a2a30] text-[#e8e8ed]" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}>
            <Monitor size={14} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="tablet" className={cn("p-1.5 rounded transition-colors", viewport === 'tablet' ? "bg-[#2a2a30] text-[#e8e8ed]" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}>
            <Tablet size={14} />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="mobile" className={cn("p-1.5 rounded transition-colors", viewport === 'mobile' ? "bg-[#2a2a30] text-[#e8e8ed]" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}>
            <Smartphone size={14} />
          </ToggleGroup.Item>
        </ToggleGroup.Root>

        <Separator.Root className="w-[1px] h-4 bg-[#2a2a30] mx-2" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={() => {
                    toast.success('Screenshot saved');
                  }}
                  className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors rounded"
                >
                  <Camera size={14} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-xs px-2 py-1 rounded border border-[#2a2a30] shadow-xl z-50" sideOffset={5}>
                  Capture screenshot
                  <Tooltip.Arrow className="fill-[#2a2a30]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors rounded">
                  <QrCode size={14} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-[#1c1c20] border border-[#2a2a30] p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200" sideOffset={5}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 bg-white p-2 rounded-lg">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                        <path d="M0 0h30v10H10v20H0V0zm70 0h30v30h-10V10H70V0zM0 70h10v20h20v10H0V70zm100 30H70v-10h20v-20h10v30zM20 20h20v20H20V20zm40 0h20v20H60V20zm0 40h20v20H60V60zm-40 0h20v20H20V60z" fill="currentColor" />
                        <rect x="25" y="25" width="10" height="10" fill="currentColor" />
                        <rect x="65" y="25" width="10" height="10" fill="currentColor" />
                        <rect x="65" y="65" width="10" height="10" fill="currentColor" />
                        <rect x="25" y="65" width="10" height="10" fill="currentColor" />
                        <rect x="45" y="45" width="10" height="10" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[#e8e8ed] text-xs font-medium">Scan to preview on mobile</span>
                  </div>
                  <Popover.Arrow className="fill-[#2a2a30]" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={() => setShowConsole(!showConsole)}
                  className={cn("p-1.5 rounded transition-colors", showConsole ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}
                >
                  <TerminalIcon size={14} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-xs px-2 py-1 rounded border border-[#2a2a30] shadow-xl z-50" sideOffset={5}>
                  Toggle Console
                  <Tooltip.Arrow className="fill-[#2a2a30]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors rounded">
                  <ExternalLink size={14} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-xs px-2 py-1 rounded border border-[#2a2a30] shadow-xl z-50" sideOffset={5}>
                  Open in new tab
                  <Tooltip.Arrow className="fill-[#2a2a30]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <button 
            onClick={() => setViewSource(!viewSource)}
            className={cn("p-1.5 rounded transition-colors flex items-center gap-1.5 text-xs font-medium", viewSource ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]")}
          >
            <Code2 size={14} />
            View source
          </button>
        </div>
      </div>

      {/* SECTION 2 — Preview area */}
      <div className="flex-grow bg-[#0d0d0f] relative overflow-hidden flex items-center justify-center">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center max-w-md text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20">
              <Sparkles size={32} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Describe your app to get started
            </h2>
            <p className="text-[#6b6b7a] text-sm leading-relaxed">
              Our multi-agent system will architect, build, and deploy your application in real-time. Just type what you want to build in the chat panel.
            </p>
          </div>
        ) : viewSource ? (
          <ScrollArea.Root className="w-full h-full">
            <ScrollArea.Viewport className="w-full h-full p-6">
              <pre className="font-mono text-sm leading-relaxed text-[#e8e8ed] whitespace-pre-wrap">
                <code>{sourceCode}</code>
              </pre>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[#1c1c20] w-2.5 transition-colors">
              <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-[10px]" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar orientation="horizontal" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[#1c1c20] h-2.5 transition-colors">
              <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-[10px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        ) : (
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out border border-[#2a2a30] bg-[#141416] flex items-center justify-center relative overflow-hidden",
              viewport === 'desktop' ? "w-full h-full border-0" : 
              viewport === 'tablet' ? "w-[768px] h-[calc(100%-32px)] rounded-xl shadow-2xl border-8 border-[#2a2a30]" : 
              "w-[390px] h-[calc(100%-32px)] rounded-[3rem] shadow-2xl border-[12px] border-[#2a2a30]"
            )}
          >
            {buildStatus === 'success' ? (
              <div className="w-full h-full flex items-center justify-center bg-black text-white">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Hello World
                </h1>
              </div>
            ) : (
              <div className="w-[calc(100%-32px)] h-[calc(100%-32px)] border border-dashed border-[#2a2a30] rounded flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1c1c20] flex items-center justify-center text-[#6b6b7a]">
                  <Code size={18} />
                </div>
                <span className="text-[#6b6b7a] text-sm">Waiting for first build</span>
              </div>
            )}

            {/* Console Overlay */}
            {showConsole && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#0d0d0f]/90 backdrop-blur-md border-t border-[#2a2a30] p-3 font-mono text-[10px] animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between mb-2 text-[#6b6b7a]">
                  <span className="uppercase tracking-widest font-bold">Console</span>
                  <button onClick={() => setShowConsole(false)} className="hover:text-[#e8e8ed]">
                    <X size={12} />
                  </button>
                </div>
                <ScrollArea.Root className="h-20">
                  <ScrollArea.Viewport className="w-full h-full">
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span className="text-[#6b6b7a]">[03:10:37]</span>
                        <span className="text-emerald-400">log:</span>
                        <span className="text-[#e8e8ed]">App initialized successfully</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#6b6b7a]">[03:10:38]</span>
                        <span className="text-emerald-400">log:</span>
                        <span className="text-[#e8e8ed]">Vite HMR connected</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#6b6b7a]">[03:10:40]</span>
                        <span className="text-blue-400">info:</span>
                        <span className="text-[#e8e8ed]">Fetching user data...</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#6b6b7a]">[03:10:41]</span>
                        <span className="text-amber-400">warn:</span>
                        <span className="text-[#e8e8ed]">Performance warning: slow render detected</span>
                      </div>
                    </div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent w-1.5 transition-colors">
                    <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-full" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3 — Build status strip */}
      <div className="h-8 bg-[#141416] border-t border-[#2a2a30] flex items-center px-4 gap-4 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", isBuilding ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
          <span className="text-[#6b6b7a]">
            Active agent: <span className="text-[#e8e8ed] font-medium">{activeAgent?.name || 'None'}</span>
          </span>
        </div>

        <Separator.Root className="w-[1px] h-3 bg-[#2a2a30]" />

        <div className="text-[#6b6b7a]">
          <span className="text-[#e8e8ed] font-medium">{totalTokens.toLocaleString()}</span> tokens used
        </div>

        <Separator.Root className="w-[1px] h-3 bg-[#2a2a30]" />

        <div className="flex items-center gap-1.5 text-[#6b6b7a]">
          Build: {buildTime}s
          <div className={cn("w-1.5 h-1.5 rounded-full", buildStatus === 'success' ? "bg-emerald-500/80" : "bg-[#2a2a30]")} />
        </div>

        <div className="ml-auto text-[#6b6b7a]">
          <span className="text-[#e8e8ed] font-medium">{filesGenerated}</span> files generated
        </div>
      </div>
    </div>
  );
}
