import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Terminal, 
  CreditCard, 
  Cpu, 
  Zap, 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Mail, 
  LogOut, 
  Trash2, 
  Save, 
  RefreshCw,
  Code,
  Users,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Separator from '@radix-ui/react-separator';
import * as Switch from '@radix-ui/react-switch';
import CLIReference from './CLIReference';
import { MemberManagement } from './MemberManagement';
import { WorkspaceSettings } from './WorkspaceSettings';

import { useThemeStore } from '../../lib/theme';

type SettingsSection = 'general' | 'workspace' | 'members' | 'account' | 'security' | 'cli' | 'billing' | 'advanced';

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const { theme, toggleTheme } = useThemeStore();

  const sections: { id: SettingsSection; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'workspace', label: 'Workspace', icon: Layout },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'cli', label: 'Torsor CLI', icon: Terminal },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'advanced', label: 'Advanced', icon: Cpu },
  ];

  return (
    <div className="flex h-full bg-page">
      {/* Sidebar */}
      <aside className="w-[220px] border-r border-default bg-surface flex flex-col shrink-0">
        <header className="h-12 px-4 flex items-center border-b border-default bg-elevated">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Settings</span>
        </header>
        <ScrollArea.Root className="flex-1">
          <ScrollArea.Viewport className="h-full">
            <nav className="p-2 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    activeSection === section.id 
                      ? "bg-accent/10 text-accent border border-accent/20" 
                      : "text-secondary hover:text-primary hover:bg-elevated"
                  )}
                >
                  <section.icon size={16} />
                  {section.label}
                </button>
              ))}
            </nav>
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        <div className="p-4 border-t border-default">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-error hover:bg-error/10 rounded-lg transition-all">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 px-6 flex items-center justify-between border-b border-default bg-surface shrink-0">
          <h2 className="text-sm font-bold text-primary">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-elevated hover:bg-inset border border-default text-primary text-[11px] font-bold rounded-lg transition-all">
              <RefreshCw size={14} />
              Reset
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent-hover text-white text-[11px] font-bold rounded-lg shadow-lg shadow-accent/20 transition-all">
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </header>

        <ScrollArea.Root className="flex-1">
          <ScrollArea.Viewport className="h-full">
            <div className="p-8 max-w-3xl mx-auto">
              {activeSection === 'general' && (
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Appearance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary">Dark Mode</p>
                          <p className="text-[11px] text-secondary">Use the dark theme across the application.</p>
                        </div>
                        <Switch.Root 
                          checked={theme === 'dark'}
                          onCheckedChange={toggleTheme}
                          className="w-10 h-5 bg-elevated rounded-full relative data-[state=checked]:bg-accent transition-colors outline-none cursor-pointer"
                        >
                          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary">Compact Mode</p>
                          <p className="text-[11px] text-secondary">Reduce spacing between UI elements.</p>
                        </div>
                        <Switch.Root className="w-10 h-5 bg-elevated rounded-full relative data-[state=checked]:bg-accent transition-colors outline-none cursor-pointer">
                          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                    </div>
                  </section>

                  <Separator.Root className="h-[1px] bg-default" />

                  <section className="space-y-4">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Editor Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary">Auto-save</p>
                          <p className="text-[11px] text-secondary">Automatically save changes as you type.</p>
                        </div>
                        <Switch.Root className="w-10 h-5 bg-elevated rounded-full relative data-[state=checked]:bg-accent transition-colors outline-none cursor-pointer">
                          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary">Minimap</p>
                          <p className="text-[11px] text-secondary">Show a minimap in the code editor.</p>
                        </div>
                        <Switch.Root className="w-10 h-5 bg-elevated rounded-full relative data-[state=checked]:bg-accent transition-colors outline-none cursor-pointer">
                          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeSection === 'workspace' && <WorkspaceSettings />}
              {activeSection === 'members' && <MemberManagement />}
              {activeSection === 'cli' && <CLIReference />}

              {activeSection !== 'general' && activeSection !== 'workspace' && activeSection !== 'members' && activeSection !== 'cli' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface border border-default flex items-center justify-center mb-4">
                    <Settings size={32} className="text-tertiary" />
                  </div>
                  <h3 className="text-sm font-bold text-primary">{sections.find(s => s.id === activeSection)?.label} Settings</h3>
                  <p className="text-xs text-secondary mt-2">These settings are currently under development.</p>
                </div>
              )}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="w-1.5 bg-transparent p-0.5">
            <ScrollArea.Thumb className="bg-default rounded-full" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </main>
    </div>
  );
}
