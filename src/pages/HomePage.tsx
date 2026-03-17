import React from 'react';
import { HomeSidebar } from '../components/shell/HomeSidebar';
import { HomeContent } from '../components/home/HomeContent';

export function HomePage() {
  return (
    <div className="flex bg-[#0a0a0c] min-h-screen">
      <HomeSidebar />
      <HomeContent />
    </div>
  );
}
