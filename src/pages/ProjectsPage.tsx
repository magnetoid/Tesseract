import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  Globe, 
  Smartphone, 
  Palette, 
  LayoutDashboard, 
  Server, 
  Gamepad2, 
  Sparkles, 
  Puzzle,
  ChevronDown,
  Filter
} from 'lucide-react';
import { HomeSidebar } from '../components/shell/HomeSidebar';
import { useProjectStore, Project } from '../stores/projectStore';
import { cn } from '../lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const PROJECT_TYPES = [
  { id: 'website', icon: Globe, label: 'Website' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  { id: 'design', icon: Palette, label: 'Design' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'api', icon: Server, label: 'API' },
  { id: 'game', icon: Gamepad2, label: 'Game' },
  { id: 'ai', icon: Sparkles, label: 'AI App' },
  { id: 'extension', icon: Puzzle, label: 'Extension' },
];

export function ProjectsPage() {
  const { projects, deleteProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'shared' | 'archived'>('all');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#0a0a0c] min-h-screen">
      <HomeSidebar />
      
      <main className="flex-1 ml-[220px] overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#e8e8ed]">Projects</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b7a]" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-64 bg-[#141416] border border-[#232328] rounded-lg pl-9 pr-3 py-1.5 text-sm text-[#e8e8ed] outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div className="flex items-center bg-[#141416] border border-[#232328] rounded-lg p-0.5">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === 'grid' ? "bg-[#1c1c20] text-[#e8e8ed]" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
                  )}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === 'list' ? "bg-[#1c1c20] text-[#e8e8ed]" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
                  )}
                >
                  <List size={16} />
                </button>
              </div>
              <button className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-[#232328] mb-6">
            <div className="flex gap-6">
              {['all', 'my', 'shared', 'archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "pb-3 text-sm font-medium capitalize transition-colors relative",
                    activeTab === tab ? "text-[#e8e8ed]" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
                  )}
                >
                  {tab === 'all' ? 'All' : tab === 'my' ? 'My Projects' : tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
                  )}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-xs text-[#6b6b7a] hover:text-[#e8e8ed] mb-3 transition-colors">
              <Filter size={14} />
              <span>Sort: Last Edited</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="group bg-[#141416] border border-[#232328] rounded-xl overflow-hidden hover:border-violet-500/30 transition-all flex flex-col"
                >
                  <Link to={`/project/${project.id}`} className="h-[140px] bg-[#0a0a0c] flex items-center justify-center p-4 relative">
                    <div className="w-14 h-14 rounded-lg bg-[#1c1c20] flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                      {(() => {
                        const Icon = PROJECT_TYPES.find(t => t.id === project.type)?.icon || Globe;
                        return <Icon size={28} />;
                      })()}
                    </div>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/project/${project.id}`} className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#e8e8ed] truncate group-hover:text-violet-500 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-[#6b6b7a] mt-1 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </Link>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content 
                            className="min-w-[160px] bg-[#1c1c20] border border-[#232328] rounded-lg p-1 shadow-xl z-50"
                            sideOffset={5}
                          >
                            <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-xs text-[#e8e8ed] outline-none hover:bg-[#232328] rounded-md cursor-pointer">
                              Rename
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-xs text-[#e8e8ed] outline-none hover:bg-[#232328] rounded-md cursor-pointer">
                              Duplicate
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-xs text-[#e8e8ed] outline-none hover:bg-[#232328] rounded-md cursor-pointer">
                              Archive
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="h-px bg-[#232328] my-1" />
                            <DropdownMenu.Item 
                              onClick={() => deleteProject(project.id)}
                              className="flex items-center px-2 py-1.5 text-xs text-red-500 outline-none hover:bg-red-500/10 rounded-md cursor-pointer"
                            >
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.teamAvatars?.map((avatar, i) => (
                          <img 
                            key={i}
                            src={avatar} 
                            alt="Team member"
                            className="w-6 h-6 rounded-full border-2 border-[#141416]"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#6b6b7a] uppercase tracking-wider font-semibold">
                        Edited {project.lastEdited}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-[#141416] border border-[#232328] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#232328] text-[10px] uppercase tracking-wider font-semibold text-[#6b6b7a]">
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Last Edited</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232328]">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="group hover:bg-[#1c1c20] transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/project/${project.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#0a0a0c] flex items-center justify-center text-violet-500">
                            {(() => {
                              const Icon = PROJECT_TYPES.find(t => t.id === project.type)?.icon || Globe;
                              return <Icon size={16} />;
                            })()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[#e8e8ed] truncate group-hover:text-violet-500 transition-colors">
                              {project.name}
                            </div>
                            <div className="text-xs text-[#6b6b7a] truncate max-w-[300px]">
                              {project.description}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#6b6b7a] capitalize">{project.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#6b6b7a]">{project.lastEdited}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex -space-x-2">
                          {project.teamAvatars?.map((avatar, i) => (
                            <img 
                              key={i}
                              src={avatar} 
                              alt="Team member"
                              className="w-5 h-5 rounded-full border-2 border-[#141416]"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#232328] rounded-md transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
