import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Grid, 
  Globe, 
  Settings, 
  Search, 
  ChevronDown, 
  Plus, 
  Download, 
  Lightbulb, 
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  PlusCircle,
  Building2,
  Zap,
  Users,
  CreditCard,
  HelpCircle,
  LogOut,
  Star,
  Clock,
  Lock
} from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';
import { useLayoutStore } from '../../stores/layoutStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useProjectStore } from '../../stores/projectStore';
import { UpgradeDialog } from '../shared/UpgradeDialog';
import { WorkspaceSwitcher } from '../shared/WorkspaceSwitcher';
import { NotificationBell } from '../shared/NotificationBell';
import { usePlanGate } from '../../hooks/usePlanGate';

export function HomeSidebar() {
  const navigate = useNavigate();
  const { homeSidebarCollapsed, toggleHomeSidebar } = useLayoutStore();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { projects } = useProjectStore();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  
  const { checkFeature } = usePlanGate();
  const projectGate = checkFeature('create_project');

  const activeWorkspace = getActiveWorkspace();
  const workspaceProjects = projects.filter(p => p.workspaceId === activeWorkspace?.id);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/projects', icon: Grid, label: 'Projects' },
    { to: '/recent', icon: Clock, label: 'Recent' },
    { to: '/starred', icon: Star, label: 'Starred' },
    { to: '/shared', icon: Users, label: 'Shared with me' },
  ];

  const settingsItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/billing', icon: CreditCard, label: 'Billing' },
    { to: '/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  const projectLimit = activeWorkspace?.limits.maxProjects || 3;
  const projectUsage = workspaceProjects.length;
  const projectProgress = projectLimit === -1 ? 0 : (projectUsage / projectLimit) * 100;

  const tokenLimit = activeWorkspace?.limits.maxTokensPerMonth || 50000;
  const tokenUsage = activeWorkspace?.usage.tokensUsedThisMonth || 0;
  const tokenProgress = (tokenUsage / tokenLimit) * 100;

  const handleNewProject = () => {
    if (!projectGate.allowed) {
      setUpgradeDialogOpen(true);
      return;
    }
    navigate('/projects?new=true');
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <aside 
        className={cn(
          "bg-surface border-r border-default h-screen flex flex-col sticky left-0 top-0 z-[60] transition-all duration-300 ease-in-out",
          homeSidebarCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Workspace Switcher */}
        <div className="p-3 border-b border-default">
          <WorkspaceSwitcher collapsed={homeSidebarCollapsed} />
        </div>

        {/* Action Buttons */}
        <div className="p-3 flex flex-col gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button 
                onClick={handleNewProject}
                className={cn(
                  "flex items-center transition-all rounded-xl group overflow-hidden relative",
                  homeSidebarCollapsed 
                    ? "justify-center w-10 h-10 hover:bg-elevated" 
                    : "gap-3 px-3 py-2.5 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20",
                  !projectGate.allowed && !homeSidebarCollapsed && "opacity-80 grayscale-[0.5]"
                )}
              >
                {!projectGate.allowed && (
                  <div className="absolute top-0 right-0 p-1">
                    <Lock size={10} className="text-white/60" />
                  </div>
                )}
                <Plus size={18} className={cn("shrink-0", !homeSidebarCollapsed && "group-hover:rotate-90 transition-transform")} />
                {!homeSidebarCollapsed && <span className="text-sm font-bold truncate">New Project</span>}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="right" sideOffset={10} className="bg-elevated text-primary text-xs px-2 py-1 rounded border border-default shadow-xl z-[100] max-w-[200px]">
                {!projectGate.allowed ? `Upgrade required: ${projectGate.reason}` : "New Project"}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-2 px-3">
            {!homeSidebarCollapsed && <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Workspace</span>}
          </div>
          {navItems.map((item) => (
            <Tooltip.Root key={item.to}>
              <Tooltip.Trigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center transition-all rounded-xl group",
                    homeSidebarCollapsed 
                      ? "justify-center w-10 h-10 hover:bg-elevated" 
                      : "gap-3 px-3 py-2",
                    isActive 
                      ? "bg-accent-muted text-accent" 
                      : "text-secondary hover:text-primary hover:bg-elevated"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!homeSidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                </NavLink>
              </Tooltip.Trigger>
              {homeSidebarCollapsed && (
                <Tooltip.Portal>
                  <Tooltip.Content side="right" sideOffset={10} className="bg-elevated text-primary text-xs px-2 py-1 rounded border border-default shadow-xl z-[100]">
                    {item.label}
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          ))}

          <div className="py-1">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className={cn(
                  "flex items-center transition-all rounded-xl group cursor-pointer",
                  homeSidebarCollapsed 
                    ? "justify-center w-10 h-10" 
                    : "gap-3 px-1 py-1"
                )}>
                  <NotificationBell className={cn(
                    "w-full flex items-center transition-all rounded-xl",
                    homeSidebarCollapsed ? "justify-center h-10" : "gap-3 px-2 py-2"
                  )} />
                  {!homeSidebarCollapsed && <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">Notifications</span>}
                </div>
              </Tooltip.Trigger>
              {homeSidebarCollapsed && (
                <Tooltip.Portal>
                  <Tooltip.Content side="right" sideOffset={10} className="bg-elevated text-primary text-xs px-2 py-1 rounded border border-default shadow-xl z-[100]">
                    Notifications
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          </div>

          <div className="mt-6 mb-2 px-3">
            {!homeSidebarCollapsed && <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Account</span>}
          </div>
          {settingsItems.map((item) => (
            <Tooltip.Root key={item.to}>
              <Tooltip.Trigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center transition-all rounded-xl group",
                    homeSidebarCollapsed 
                      ? "justify-center w-10 h-10 hover:bg-elevated" 
                      : "gap-3 px-3 py-2",
                    isActive 
                      ? "bg-accent-muted text-accent" 
                      : "text-secondary hover:text-primary hover:bg-elevated"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!homeSidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                </NavLink>
              </Tooltip.Trigger>
              {homeSidebarCollapsed && (
                <Tooltip.Portal>
                  <Tooltip.Content side="right" sideOffset={10} className="bg-elevated text-primary text-xs px-2 py-1 rounded border border-default shadow-xl z-[100]">
                    {item.label}
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-default space-y-4">
          {/* Plan Usage */}
          {!homeSidebarCollapsed && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-tertiary">Projects</span>
                  <span className="text-secondary">{projectUsage} / {projectLimit === -1 ? '∞' : projectLimit}</span>
                </div>
                <div className="h-1 bg-inset rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", projectProgress > 90 ? "bg-error" : "bg-accent")}
                    style={{ width: `${Math.min(projectProgress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-tertiary">Tokens</span>
                  <span className="text-secondary">{(tokenUsage / 1000).toFixed(1)}K / {(tokenLimit / 1000).toFixed(0)}K</span>
                </div>
                <div className="h-1 bg-inset rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", tokenProgress > 90 ? "bg-error" : "bg-accent")}
                    style={{ width: `${Math.min(tokenProgress, 100)}%` }}
                  />
                </div>
              </div>

              <button 
                onClick={() => setUpgradeDialogOpen(true)}
                className="w-full py-2 bg-elevated hover:bg-bg-inset border border-default rounded-xl text-xs font-bold text-primary transition-all flex items-center justify-center gap-2 group"
              >
                <Zap size={14} className="text-warning group-hover:scale-110 transition-transform" />
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Sidebar Toggle */}
          <button 
            onClick={toggleHomeSidebar}
            className={cn(
              "flex items-center transition-all rounded-xl text-tertiary hover:text-primary hover:bg-elevated",
              homeSidebarCollapsed ? "justify-center w-10 h-10" : "gap-3 px-3 py-2 w-full"
            )}
          >
            {homeSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!homeSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      <UpgradeDialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen} />
    </Tooltip.Provider>
  );
}
