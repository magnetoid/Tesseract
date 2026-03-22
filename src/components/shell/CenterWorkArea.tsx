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
import SecretsTab from '../tabs/SecretsTab';
import AppStorageTab from '../tabs/AppStorageTab';
import AuthTab from '../tabs/AuthTab';
import PublishingTab from '../tabs/PublishingTab';
import ValidationTab from '../tabs/ValidationTab';
import GitTab from '../tabs/GitTab';
import WorkflowsTab from '../tabs/WorkflowsTab';
import CanvasTab from '../tabs/CanvasTab';
import AppTestingTab from '../tabs/AppTestingTab';
import SettingsTab from '../tabs/SettingsTab';

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
      case 'secrets': return <SecretsTab />;
      case 'storage': return <AppStorageTab />;
      case 'auth': return <AuthTab />;
      case 'publishing': return <PublishingTab />;
      case 'validation': return <ValidationTab />;
      case 'git': return <GitTab />;
      case 'workflow': return <WorkflowsTab />;
      case 'canvas': return <CanvasTab />;
      case 'testing': return <AppTestingTab />;
      case 'settings': return <SettingsTab />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-secondary">
            {tab.label} Content (Coming Soon)
          </div>
        );
    }
  };

  const renderContent = () => {
    if (!activeTab) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-secondary gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-default flex items-center justify-center">
            <div className="w-8 h-8 bg-elevated rounded-lg" />
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
          className="relative overflow-hidden border-b border-default"
        >
          {renderTabContent(activeTab)}
        </div>
        
        {/* Resize Handle */}
        <div 
          className={cn(
            "bg-default hover:bg-accent/50 transition-colors cursor-pointer z-20",
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
    <main className="flex-1 bg-page flex flex-col min-w-0 overflow-hidden">
      <TabBar />
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>
    </main>
  );
}
