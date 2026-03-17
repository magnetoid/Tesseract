import React from 'react';
import { TabBar } from './TabBar';
import { useLayoutStore } from '../../stores/layoutStore';
import { cn } from '../../lib/utils';
import PreviewTab from '../tabs/PreviewTab';
import CodeEditorTab from '../tabs/CodeEditorTab';
import TerminalTab from '../tabs/TerminalTab';
import DatabaseTab from '../tabs/DatabaseTab';
import SecurityScanTab from '../tabs/SecurityScanTab';
import IntegrationsTab from '../tabs/IntegrationsTab';
import AgentSkillsTab from '../tabs/AgentSkillsTab';
// import SettingsTab from '../tabs/SettingsTab';

export function CenterWorkArea() {
  const { 
    centerTabs, 
    activeTabId, 
    secondaryTabId, 
    splitDirection, 
    splitRatio, 
    setSplitRatio 
  } = useLayoutStore();
  
  const activeTab = centerTabs.find(t => t.id === activeTabId);
  const secondaryTab = centerTabs.find(t => t.id === secondaryTabId);

  const renderTabContent = (tab: any) => {
    if (!tab) return null;
    switch (tab.type) {
      case 'preview': return <PreviewTab />;
      case 'code': return <CodeEditorTab />;
      case 'terminal': return <TerminalTab />;
      case 'database': return <DatabaseTab />;
      case 'security': return <SecurityScanTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'skills': return <AgentSkillsTab />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-[#6b6b7a]">
            {tab.label} Content (Coming Soon)
          </div>
        );
    }
  };

  const renderContent = () => {
    if (!activeTab) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-[#6b6b7a] gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#141416] border border-[#232328] flex items-center justify-center">
            <div className="w-8 h-8 bg-[#232328] rounded-lg" />
          </div>
          <p className="text-sm font-medium">Open a tool from the sidebar</p>
        </div>
      );
    }

    if (splitDirection === 'none' || !secondaryTab) {
      return renderTabContent(activeTab);
    }

    return (
      <div className={cn(
        "flex-1 flex",
        splitDirection === 'vertical' ? "flex-col" : "flex-row"
      )}>
        <div 
          style={{ flex: splitRatio }} 
          className="relative overflow-hidden border-b border-[#232328]"
        >
          {renderTabContent(activeTab)}
        </div>
        
        {/* Resize Handle */}
        <div 
          className={cn(
            "bg-[#232328] hover:bg-violet-500/50 transition-colors cursor-pointer z-20",
            splitDirection === 'vertical' ? "h-1 w-full" : "w-1 h-full"
          )}
          onMouseDown={(e) => {
            const startPos = splitDirection === 'vertical' ? e.clientY : e.clientX;
            const startRatio = splitRatio;
            const totalSize = splitDirection === 'vertical' ? window.innerHeight : window.innerWidth;

            const onMouseMove = (moveEvent: MouseEvent) => {
              const currentPos = splitDirection === 'vertical' ? moveEvent.clientY : moveEvent.clientX;
              const delta = (currentPos - startPos) / totalSize;
              setSplitRatio(Math.max(0.1, Math.min(0.9, startRatio + delta)));
            };

            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        />

        <div style={{ flex: 1 - splitRatio }} className="relative overflow-hidden">
          {renderTabContent(secondaryTab)}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 bg-[#0a0a0c] flex flex-col min-w-0 overflow-hidden">
      <TabBar />
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>
    </main>
  );
}
