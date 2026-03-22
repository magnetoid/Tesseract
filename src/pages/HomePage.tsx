import React from 'react';
import { HomeSidebar } from '../components/shell/HomeSidebar';
import { HomeContent } from '../components/home/HomeContent';
import { useLayoutStore } from '../stores/layoutStore';
import { cn } from '../lib/utils';

export function HomePage() {
  const { homeSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex bg-page min-h-screen">
      <HomeSidebar />
      <div className={cn(
        "flex-1 transition-all duration-200 ease-in-out",
        homeSidebarCollapsed ? "ml-[56px]" : "ml-[220px]"
      )}>
        <HomeContent />
      </div>
    </div>
  );
}
