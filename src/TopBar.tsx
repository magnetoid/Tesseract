import React, { useState, useRef, useEffect } from 'react';
import * as Separator from '@radix-ui/react-separator';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { MessageSquare, Code2, Settings, Play, Loader2, Rocket, Zap, Shield, Leaf, Monitor, Smartphone, Tablet, Camera, QrCode, Terminal, Eye, FileCode, GitBranch, Plus, Share2, Copy, Send, Trash2, Users, Star, Gift, Layout, Globe, Lock, MoreVertical, GitFork, X, ChevronDown, CreditCard } from 'lucide-react';
import { 
  useAgents, 
  useMode, 
  useAppStore,
  AgentStatus,
  EconomyMode,
  useFiles
} from './useAppStore';
import { useEditorStore } from './stores/editorStore';
import { useGitStore } from './stores/gitStore';
import { useSocialStore } from './stores/socialStore';
import { useAuthStore } from './stores/authStore';
import { DeployModal } from './DeployModal';
import { BillingModal } from './components/billing/BillingModal';
import { PublishTemplateDialog } from './components/shared/PublishTemplateDialog';
import { cn } from './lib/utils';

const getStatusColor = (status: AgentStatus) => {
  switch (status) {
    case 'idle': return 'bg-gray-500';
    case 'thinking': return 'bg-amber-500 animate-pulse';
    case 'running': return 'bg-violet-500 animate-pulse';
    case 'done': return 'bg-emerald-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const mode = useMode();
  const setMode = useAppStore(state => state.setMode);
  const agents = useAgents();
  const simulateBuilderFlow = useAppStore(state => state.simulateBuilderFlow);
  const economyMode = useAppStore(state => state.economyMode);
  const setEconomyMode = useAppStore(state => state.setEconomyMode);
  const isPreviewOpen = useAppStore(state => state.isPreviewOpen);
  const togglePreview = useAppStore(state => state.togglePreview);
  const isBillingModalOpen = useAppStore(state => state.isBillingModalOpen);
  const setBillingModalOpen = useAppStore(state => state.setBillingModalOpen);
  const isCodeOpen = useEditorStore(state => state.isCodeOpen);
  const toggleCode = useEditorStore(state => state.toggleCode);
  const files = useFiles();
  const { currentBranch, branches, switchBranch, createBranch } = useGitStore();
  const { shareLink, accessLevel, setAccessLevel, allowForking, setAllowForking, collaborators, invitePerson, removeCollaborator, publishTemplate, forkProject } = useSocialStore();
  const { user } = useAuthStore();
  
  const hasFiles = files.length > 0;
  const isRunning = agents.some(a => a.status === 'running' || a.status === 'thinking');

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('Untitled Project');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Add a local state for the loading spinner during mode transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeChange = (newMode: 'builder' | 'ide') => {
    if (!newMode || newMode === mode) return;
    setIsTransitioning(true);
    // Simulate a short loading state for the transition
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    if (!tempName.trim()) {
      setTempName('Untitled Project');
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };

  const handleRun = () => {
    if (!isRunning) {
      simulateBuilderFlow("Build a multi-agent IDE with React and Tailwind");
    }
  };

  return (
    <div className="h-12 shrink-0 flex items-center justify-between bg-[#141416] border-b border-[#2a2a30] px-4 relative z-50">
      
      {/* Left Section */}
      <div className="flex items-center">
        {/* Logo */}
        <div className="relative w-5 h-5 mr-3 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-violet-500">
            <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="8" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Project Name */}
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center">
              <VisuallyHidden.Root>
                <label htmlFor="project-name-input">Project Name</label>
              </VisuallyHidden.Root>
              <input
                id="project-name-input"
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                className="bg-[#1c1c20] border border-violet-500/50 outline-none text-sm font-semibold text-[#e8e8ed] px-2 py-0.5 rounded w-40 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          ) : (
            <button 
              onClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-[#e8e8ed] hover:bg-[#1c1c20] px-2 py-0.5 rounded transition-colors truncate max-w-[200px]"
            >
              {tempName}
            </button>
          )}

          {economyMode === 'max-power' && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-in fade-in zoom-in-95 duration-500">
              <Zap size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-amber-400 tracking-tighter uppercase">MAX</span>
            </div>
          )}
        </div>

        <Separator.Root orientation="vertical" className="h-4 w-[1px] bg-[#2a2a30] mx-3" />

        {/* Branch Indicator */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-1 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded transition-colors outline-none">
              <GitBranch size={14} />
              <span className="text-xs font-medium">{currentBranch}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="start" 
              sideOffset={8}
              className="min-w-[180px] bg-[#1c1c20] border border-[#2a2a30] rounded-md p-1 shadow-xl z-50 text-sm text-[#e8e8ed]"
            >
              <DropdownMenu.Label className="px-2 py-1 text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">
                Branches
              </DropdownMenu.Label>
              {branches.map(branch => (
                <DropdownMenu.Item 
                  key={branch}
                  onSelect={() => switchBranch(branch)}
                  className={cn(
                    "px-2 py-1.5 outline-none cursor-pointer rounded-sm transition-colors flex items-center justify-between",
                    branch === currentBranch ? "bg-violet-500/10 text-violet-400" : "hover:bg-[#2a2a30]"
                  )}
                >
                  {branch}
                  {branch === currentBranch && <div className="w-1 h-1 rounded-full bg-violet-400" />}
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
              <div className="px-2 py-1.5 flex items-center gap-2">
                <Plus size={12} className="text-[#6b6b7a]" />
                <input 
                  placeholder="New branch..."
                  className="bg-transparent border-none outline-none text-xs w-full placeholder:text-[#6b6b7a]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createBranch(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Center Section (Absolute Centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ToggleGroup.Root 
          type="single" 
          value={mode} 
          onValueChange={handleModeChange}
          className="flex bg-[#0d0d0f] rounded-md p-0.5 border border-[#2a2a30]"
        >
          <ToggleGroup.Item 
            value="builder" 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm outline-none transition-all data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-400 text-[#6b6b7a] hover:text-[#e8e8ed] data-[state=on]:hover:text-violet-300 relative"
          >
            {isTransitioning && mode === 'ide' ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
            Builder
          </ToggleGroup.Item>
          <ToggleGroup.Item 
            value="ide" 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm outline-none transition-all data-[state=on]:bg-violet-500/20 data-[state=on]:text-violet-400 text-[#6b6b7a] hover:text-[#e8e8ed] data-[state=on]:hover:text-violet-300 relative"
          >
            {isTransitioning && mode === 'builder' ? <Loader2 size={14} className="animate-spin" /> : <Code2 size={14} />}
            IDE
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Presence Indicators */}
        <div className="flex items-center -space-x-2 mr-2 group cursor-pointer relative">
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="flex items-center -space-x-2">
                  {collaborators.filter(c => c.isOnline).slice(0, 3).map(c => (
                    <div 
                      key={c.id} 
                      className="w-6 h-6 rounded-full border-2 border-[#141416] overflow-hidden bg-[#1c1c20]"
                    >
                      <img src={c.avatar} alt={c.name} referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  {collaborators.filter(c => c.isOnline).length > 3 && (
                    <div className="w-6 h-6 rounded-full border-2 border-[#141416] bg-[#2a2a30] flex items-center justify-center text-[10px] font-bold text-[#e8e8ed]">
                      +{collaborators.filter(c => c.isOnline).length - 3}
                    </div>
                  )}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content 
                  className="bg-[#1c1c20] text-[#e8e8ed] text-xs px-2 py-1 rounded border border-[#2a2a30] shadow-xl z-50" 
                  sideOffset={5}
                >
                  {collaborators.filter(c => c.isOnline).length} people viewing
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        {/* On-demand Code Button */}
        {hasFiles && mode === 'builder' && (
          <button 
            onClick={() => toggleCode()}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all",
              isCodeOpen 
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" 
                : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]"
            )}
          >
            <FileCode size={14} />
            <span>Code</span>
          </button>
        )}

        {/* Preview Toggle */}
        {mode === 'builder' && (
          <button 
            onClick={() => togglePreview()}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all",
              isPreviewOpen 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]"
            )}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        )}

        <Separator.Root orientation="vertical" className="h-4 w-[1px] bg-[#2a2a30] mx-1" />
        <div className="flex items-center gap-1.5">
          <Tooltip.Provider delayDuration={200}>
            {agents.map(agent => (
              <Tooltip.Root key={agent.id}>
                <Tooltip.Trigger asChild>
                  <div className={`w-2 h-2 rounded-full cursor-default ${getStatusColor(agent.status)}`} />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content 
                    className="bg-[#1c1c20] text-[#e8e8ed] text-xs px-2 py-1 rounded border border-[#2a2a30] shadow-xl z-50 flex items-center gap-2" 
                    sideOffset={5}
                  >
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-[#6b6b7a] uppercase text-[10px] tracking-wider">· {agent.status}</span>
                    <Tooltip.Arrow className="fill-[#2a2a30]" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </Tooltip.Provider>
        </div>

        <Separator.Root orientation="vertical" className="h-4 w-[1px] bg-[#2a2a30] mx-1" />

        {/* Run Button */}
        <div className="flex items-center gap-2">
          {user && (
            <button 
              onClick={() => setBillingModalOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border transition-all duration-300",
                user.tokenBalance < 10000 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-[#1c1c20] text-[#6b6b7a] border-[#2a2a30] hover:border-violet-500/30"
              )}
            >
              <CreditCard size={10} />
              <span className="tabular-nums">{(user.tokenBalance ?? 0).toLocaleString()}</span>
            </button>
          )}
          
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border transition-all duration-300",
            economyMode === 'max-power' 
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]" 
              : "bg-[#1c1c20] text-[#6b6b7a] border-[#2a2a30]"
          )}>
            <span className="opacity-50">$</span>
            <span className="tabular-nums">{economyMode === 'max-power' ? '0.42' : '0.08'}</span>
          </div>

          <button 
            onClick={handleRun}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-white text-sm font-medium rounded-md shadow-sm transition-all duration-300",
              economyMode === 'max-power'
                ? "bg-amber-600 hover:bg-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                : "bg-violet-600 hover:bg-violet-500"
            )}
          >
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>

        {/* Deploy Button */}
        <button 
          onClick={() => setIsDeployModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-sm font-medium rounded-md transition-colors"
        >
          <Rocket size={14} />
          <span>Deploy</span>
        </button>

        {/* Fork Button (Mock: only show if "not my project") */}
        {tempName === 'Community Project' && (
          <button 
            onClick={() => forkProject('abc123')}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1c1c20] text-[#e8e8ed] hover:bg-[#2a2a30] text-sm font-medium rounded-md border border-[#2a2a30] transition-colors"
          >
            <GitFork size={14} />
            <span>Fork</span>
          </button>
        )}

        {/* Share Popover */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-md shadow-sm transition-all">
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content 
              sideOffset={8} 
              align="end"
              className="w-80 bg-[#1c1c20] border border-[#2a2a30] rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#e8e8ed]">Share this project</h3>
                  <Popover.Close className="text-[#6b6b7a] hover:text-[#e8e8ed]">
                    <X size={16} />
                  </Popover.Close>
                </div>

                <div className="flex items-center gap-2 bg-[#0d0d0f] p-2 rounded border border-[#2a2a30]">
                  <span className="text-xs text-[#6b6b7a] truncate flex-1">{shareLink}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(shareLink)}
                    className="p-1.5 text-[#6b6b7a] hover:text-violet-400 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Access level</label>
                  <Select.Root value={accessLevel} onValueChange={(v) => setAccessLevel(v as any)}>
                    <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-[#0d0d0f] border border-[#2a2a30] rounded-md text-xs text-[#e8e8ed] outline-none">
                      <Select.Value />
                      <ChevronDown size={14} className="text-[#6b6b7a]" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-[#1c1c20] border border-[#2a2a30] rounded-md shadow-xl z-[60] p-1">
                        <Select.Item value="private" className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] outline-none cursor-pointer hover:bg-violet-500/20 rounded-sm">
                          <Lock size={12} /> <Select.ItemText>Private</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="public-view" className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] outline-none cursor-pointer hover:bg-violet-500/20 rounded-sm">
                          <Globe size={12} /> <Select.ItemText>Anyone with link can view</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="public-edit" className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#e8e8ed] outline-none cursor-pointer hover:bg-violet-500/20 rounded-sm">
                          <Users size={12} /> <Select.ItemText>Anyone can edit</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Invite people</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Email address..."
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 bg-[#0d0d0f] border border-[#2a2a30] rounded-md px-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50"
                    />
                    <button 
                      onClick={() => { invitePerson(inviteEmail); setInviteEmail(''); }}
                      className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1 no-scrollbar">
                  {collaborators.map(c => (
                    <div key={c.id} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-2">
                        <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-[#e8e8ed]">{c.name}</span>
                          <span className="text-[10px] text-[#6b6b7a]">{c.role}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeCollaborator(c.id)}
                        className="p-1 text-[#6b6b7a] hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2a2a30]">
                  <span className="text-xs text-[#e8e8ed]">Allow forking</span>
                  <Switch.Root 
                    checked={allowForking}
                    onCheckedChange={setAllowForking}
                    className="w-8 h-4 bg-[#2a2a30] rounded-full relative data-[state=checked]:bg-violet-600 outline-none cursor-pointer transition-colors"
                  >
                    <Switch.Thumb className="block w-3 h-3 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
                  </Switch.Root>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Settings Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-colors outline-none">
              <MoreVertical size={16} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              align="end" 
              sideOffset={8}
              className="min-w-[180px] bg-[#1c1c20] border border-[#2a2a30] rounded-md p-1 shadow-xl z-50 text-sm text-[#e8e8ed]"
            >
              <DropdownMenu.Item 
                onSelect={onOpenSettings}
                className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors flex items-center justify-between"
              >
                Model Config
                <Settings size={12} className="opacity-50" />
              </DropdownMenu.Item>

              <DropdownMenu.Item 
                onSelect={() => setIsPublishDialogOpen(true)}
                className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors flex items-center justify-between"
              >
                Publish as template
                <Layout size={12} className="opacity-50" />
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
              
              <DropdownMenu.Label className="px-2 py-1 text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">
                Economy Mode
              </DropdownMenu.Label>
              
              <DropdownMenu.RadioGroup value={economyMode} onValueChange={(val) => setEconomyMode(val as EconomyMode)}>
                <DropdownMenu.RadioItem 
                  value="economy"
                  className="px-2 py-1.5 outline-none cursor-pointer hover:bg-emerald-500/20 hover:text-emerald-400 rounded-sm transition-colors flex items-center gap-2"
                >
                  <Leaf size={12} />
                  Economy
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem 
                  value="balanced"
                  className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors flex items-center gap-2"
                >
                  <Shield size={12} />
                  Balanced
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem 
                  value="max-power"
                  disabled={user?.plan === 'free'}
                  className={cn(
                    "px-2 py-1.5 outline-none cursor-pointer hover:bg-amber-500/20 hover:text-amber-400 rounded-sm transition-colors flex items-center justify-between",
                    user?.plan === 'free' && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Zap size={12} />
                    Max Power
                  </div>
                  {user?.plan === 'free' && <Lock size={10} className="text-[#6b6b7a]" />}
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>

              <DropdownMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
              <DropdownMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors">
                Keyboard Shortcuts
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors">
                Theme
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
              <DropdownMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-400 rounded-sm transition-colors">
                About ArrayIDE
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <DeployModal open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen} />
      <BillingModal open={isBillingModalOpen} onOpenChange={setBillingModalOpen} />
      <PublishTemplateDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen} />
    </div>
  );
}
