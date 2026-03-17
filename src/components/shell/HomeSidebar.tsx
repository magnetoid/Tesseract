import React from 'react';
import { NavLink } from 'react-router-dom';
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
  BookOpen 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function HomeSidebar() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/projects', icon: Grid, label: 'Projects' },
    { to: '/published', icon: Globe, label: 'Published Projects' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-[220px] bg-[#141416] border-r border-[#232328] h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Top Section */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#1c1c20] p-1 rounded-md transition-colors">
          <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
            M
          </div>
          <span className="text-sm font-medium text-[#e8e8ed] truncate">Marko's Workspace</span>
          <ChevronDown size={14} className="text-[#6b6b7a]" />
        </div>
        <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-colors">
          <Search size={16} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-3 mt-2 flex flex-col gap-1.5">
        <button className="flex items-center gap-2 bg-[#1c1c20] border border-[#232328] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] hover:border-[#7c6ff7]/50 transition-colors">
          <Plus size={16} className="text-violet-500" />
          <span>Create something new</span>
        </button>
        <button className="flex items-center gap-2 bg-[#1c1c20] border border-[#232328] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] hover:border-[#7c6ff7]/50 transition-colors">
          <Download size={16} className="text-[#6b6b7a]" />
          <span>Import code or design</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 mt-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
              isActive 
                ? "bg-[#1c1c20] text-[#e8e8ed]" 
                : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]"
            )}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-[#232328] p-3">
        <div className="flex flex-col gap-2 mb-4">
          <a href="#" className="flex items-center gap-2 text-xs text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
            <Lightbulb size={14} />
            <span>Learn</span>
          </a>
          <a href="#" className="flex items-center gap-2 text-xs text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
            <BookOpen size={14} />
            <span>Documentation</span>
          </a>
        </div>

        {/* Plan Card */}
        <div className="bg-[#0a0a0c] rounded-lg p-3">
          <span className="text-xs font-medium text-[#6b6b7a]">Your Free Plan</span>
          <div className="mt-2 flex flex-col gap-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#6b6b7a]">
                <span>Free Apps</span>
                <span>3/10 created</span>
              </div>
              <div className="h-1 w-full bg-[#1c1c20] rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[30%]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#6b6b7a]">
                <span>Agent credits</span>
                <span>12% used</span>
              </div>
              <div className="h-1 w-full bg-[#1c1c20] rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[12%]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#6b6b7a]">
                <span>Cloud credits</span>
                <span>0% used</span>
              </div>
              <div className="h-1 w-full bg-[#1c1c20] rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-0" />
              </div>
            </div>
          </div>
          <button className="bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium rounded-lg py-2 w-full mt-3 transition-colors">
            Upgrade to Tesseract Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
