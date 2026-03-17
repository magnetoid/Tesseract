import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Separator from '@radix-ui/react-separator';
import * as Tooltip from '@radix-ui/react-tooltip';
import { 
  Play, 
  Search, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLayoutStore } from '../../stores/layoutStore';
import { useAuthStore } from '../../stores/authStore';

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toggleLeftPanel } = useLayoutStore();
  const [projectName, setProjectName] = useState('Tesseract-Project-Alpha');
  const [isEditing, setIsEditing] = useState(false);
  const [economyMode, setEconomyMode] = useState<'turbo' | 'balanced' | 'max'>('balanced');

  const handleProjectNameBlur = () => {
    setIsEditing(false);
  };

  return (
    <header className="h-10 bg-[#141416] border-b border-[#232328] flex items-center px-2 gap-2 shrink-0 z-50">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/')}
          className="w-5 h-5 bg-violet-500 rounded flex items-center justify-center text-white hover:bg-violet-400 transition-colors"
        >
          <div className="w-2.5 h-2.5 bg-white rounded-sm" />
        </button>
        
        <div className="flex items-center gap-1">
          {isEditing ? (
            <input
              autoFocus
              className="bg-[#1c1c20] border border-violet-500/50 rounded px-1 text-sm font-medium text-[#e8e8ed] outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleProjectNameBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleProjectNameBlur()}
            />
          ) : (
            <span 
              className="text-sm font-medium text-[#e8e8ed] cursor-text px-1 hover:bg-[#1c1c20] rounded transition-colors"
              onDoubleClick={() => setIsEditing(true)}
            >
              {projectName}
            </span>
          )}
        </div>

        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-all">
                <Play size={12} fill="currentColor" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-[#1c1c20] text-[#e8e8ed] text-[10px] px-2 py-1 rounded border border-[#232328] shadow-xl" sideOffset={5}>
                Run Project
                <Tooltip.Arrow className="fill-[#232328]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <button 
          onClick={toggleLeftPanel}
          className="flex items-center gap-1.5 px-2 py-0.5 bg-[#1c1c20] hover:bg-[#232328] rounded-full border border-[#232328] transition-all group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[10px] font-bold text-[#e8e8ed]">Agent · 4</span>
        </button>
      </div>

      {/* CENTER SECTION */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1 text-[10px] text-[#6b6b7a] font-medium">
          <span>Preview</span>
          <ChevronRight size={10} />
          <span className="text-[#e8e8ed]">localhost:3000</span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2">
        <div className="flex bg-[#0a0a0c] rounded-full p-0.5 border border-[#232328]">
          {[
            { id: 'turbo', label: '⚡ Turbo' },
            { id: 'balanced', label: '⚖ Balance' },
            { id: 'max', label: '⚡⚡ Max' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setEconomyMode(mode.id as any)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-full transition-all",
                economyMode === mode.id 
                  ? "bg-violet-500 text-white shadow-sm" 
                  : "text-[#6b6b7a] hover:text-[#e8e8ed]"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <Separator.Root className="w-[1px] h-4 bg-[#232328]" />

        <button className="text-xs font-medium text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
          Invite
        </button>

        <button className="bg-violet-500 hover:bg-violet-400 text-white px-3 py-1 rounded-md text-xs font-bold transition-all shadow-lg shadow-violet-500/20">
          Publish
        </button>

        <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
          <Search size={16} />
        </button>

        <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center overflow-hidden cursor-pointer">
          <img 
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} 
            alt="User" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </header>
  );
}
