import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Clock, 
  Users, 
  Archive, 
  Settings, 
  CreditCard, 
  Layers, 
  MoreVertical, 
  Code2, 
  ExternalLink, 
  Copy, 
  Edit2, 
  Trash2,
  LogOut,
  ChevronDown,
  Box,
  Sparkles,
  Star
} from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../useAppStore';
import { useProjectStore, Project } from '../stores/projectStore';
import { useSocialStore, Template } from '../stores/socialStore';
import { BillingModal } from '../components/billing/BillingModal';
import { cn } from '../lib/utils';

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-200",
      active 
        ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500" 
        : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]"
    )}
  >
    <Icon size={18} />
    {label}
  </button>
);

const TechIcon: React.FC<{ type: string }> = ({ type }) => {
  const colors: Record<string, string> = {
    react: "bg-blue-500/20 text-blue-400",
    typescript: "bg-blue-600/20 text-blue-500",
    tailwind: "bg-cyan-500/20 text-cyan-400",
    nodejs: "bg-green-500/20 text-green-400",
    express: "bg-zinc-500/20 text-zinc-400",
    postgresql: "bg-indigo-500/20 text-indigo-400",
    nextjs: "bg-white/10 text-white",
    mdx: "bg-yellow-500/20 text-yellow-400",
    'react-native': "bg-purple-500/20 text-purple-400",
    web3: "bg-orange-500/20 text-orange-400",
  };

  return (
    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold uppercase", colors[type] || "bg-zinc-500/20 text-zinc-400")}>
      {type[0]}
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isBillingModalOpen, setBillingModalOpen } = useAppStore();
  const { projects, deleteProject, duplicateProject, archiveProject } = useProjectStore();
  const { templates } = useSocialStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'archived') return p.isArchived && matchesSearch;
    if (activeTab === 'all') return !p.isArchived && matchesSearch;
    // Mocking other tabs for now
    return !p.isArchived && matchesSearch;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ed] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-[#141416] border-r border-[#2a2a30] flex flex-col shrink-0">
        <div className="p-4">
          <Select.Root defaultValue="personal">
            <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-[#1c1c20] border border-[#2a2a30] rounded-md text-sm font-medium outline-none hover:border-violet-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-violet-500 rounded flex items-center justify-center text-[10px] text-white">T</div>
                <Select.Value />
              </div>
              <Select.Icon>
                <ChevronDown size={14} className="text-[#6b6b7a]" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-[#1c1c20] border border-[#2a2a30] rounded-md shadow-xl z-50 overflow-hidden">
                <Select.Viewport className="p-1">
                  <Select.Item value="personal" className="flex items-center px-3 py-2 text-sm text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <Select.ItemText>Personal Workspace</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="team" className="flex items-center px-3 py-2 text-sm text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <Select.ItemText>Acme Team</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <nav className="flex-1 mt-4">
          <NavItem icon={LayoutGrid} label="Projects" active />
          <NavItem icon={Sparkles} label="Model Arena" onClick={() => navigate('/arena')} />
          <NavItem icon={Users} label="Team" onClick={() => navigate('/team')} />
          <NavItem icon={CreditCard} label="Billing" onClick={() => setBillingModalOpen(true)} />
          <NavItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
        </nav>

        <div className="p-4 border-t border-[#2a2a30]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center overflow-hidden">
              <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-[#6b6b7a] truncate capitalize">{user?.plan} Plan</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6b6b7a] hover:text-red-400 hover:bg-red-400/5 rounded transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-[#2a2a30] bg-[#0d0d0f] flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold tracking-tight">Projects</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b7a]" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 bg-[#141416] border border-[#2a2a30] rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <button 
              onClick={() => {
                if (user?.plan === 'free' && projects.length >= 3) {
                  alert('Upgrade to Pro for unlimited projects');
                  return;
                }
                navigate('/onboarding');
              }}
              className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-lg shadow-violet-500/20"
            >
              <Plus size={18} />
              New Project
            </button>
          </div>
        </header>

        {/* Filters & Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Tabs.Root defaultValue="all" onValueChange={setActiveTab}>
            <Tabs.List className="flex gap-6 border-b border-[#2a2a30] mb-8">
              {['All', 'Recent', 'Templates', 'Shared with me', 'Archived'].map(tab => (
                <Tabs.Trigger 
                  key={tab} 
                  value={tab.toLowerCase().replace(/\s+/g, '-')}
                  className="pb-3 text-sm font-medium text-[#6b6b7a] data-[state=active]:text-violet-400 data-[state=active]:border-b-2 data-[state=active]:border-violet-500 transition-all outline-none"
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="templates" className="outline-none">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-violet-400" />
                    Community Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                      <div key={template.id} className="bg-[#141416] border border-[#2a2a30] rounded-xl p-5 hover:border-violet-500/30 transition-all flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <h4 className="font-bold text-[#e8e8ed]">{template.name}</h4>
                            <span className="text-[10px] text-[#6b6b7a]">by {template.author}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-bold rounded-full border border-violet-500/20">
                            <Star size={10} fill="currentColor" />
                            {template.stars}
                          </div>
                        </div>
                        <p className="text-xs text-[#6b6b7a] line-clamp-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {template.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-[#1c1c20] text-[#6b6b7a] text-[9px] font-bold rounded uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#e8e8ed]">
                            {template.price === 0 ? 'Free' : `${template.price} Credits`}
                          </span>
                          <button className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-md transition-all">
                            Use Template
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value={activeTab} className="outline-none">
              {filteredProjects.length === 0 && activeTab !== 'all' ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#141416] border border-[#2a2a30] rounded-2xl flex items-center justify-center mb-4">
                    <Box size={32} className="text-[#6b6b7a]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">No projects found</h3>
                  <p className="text-sm text-[#6b6b7a] mb-6">Try adjusting your search or filters.</p>
                </div>
              ) : filteredProjects.length === 0 && activeTab === 'all' ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#141416] border border-[#2a2a30] rounded-2xl flex items-center justify-center mb-4">
                    <Code2 size={32} className="text-[#6b6b7a]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">No projects yet</h3>
                  <p className="text-sm text-[#6b6b7a] mb-6">Create your first project to get started with Tesseract.</p>
                  <button 
                    onClick={() => navigate('/onboarding')}
                    className="bg-violet-500 hover:bg-violet-400 text-white px-6 py-2 rounded-lg font-bold transition-all"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* New Project Card */}
                  <div 
                    onClick={() => {
                      if (user?.plan === 'free' && projects.length >= 3) {
                        alert('Upgrade to Pro for unlimited projects');
                        return;
                      }
                      navigate('/onboarding');
                    }}
                    className="group h-[280px] border-2 border-dashed border-[#2a2a30] rounded-xl flex flex-col items-center justify-center gap-4 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-[#141416] border border-[#2a2a30] rounded-full flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-all">
                      <Plus size={24} />
                    </div>
                    <span className="text-sm font-bold text-[#6b6b7a] group-hover:text-[#e8e8ed]">
                      {user?.plan === 'free' && projects.length >= 3 ? 'Upgrade to Pro for unlimited projects' : 'Create new project'}
                    </span>
                  </div>

                  {/* Project Cards */}
                  {filteredProjects.map(project => (
                    <div 
                      key={project.id}
                      className="group bg-[#141416] border border-[#2a2a30] rounded-xl overflow-hidden hover:border-violet-500/30 transition-all flex flex-col h-[280px]"
                    >
                      {/* Thumbnail */}
                      <div 
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="h-32 bg-[#0d0d0f] flex items-center justify-center cursor-pointer group-hover:bg-[#1c1c20] transition-colors"
                      >
                        <Code2 size={40} className="text-[#2a2a30] group-hover:text-violet-500/20 transition-colors" />
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-1">
                          <h4 
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="font-bold text-[#e8e8ed] hover:text-violet-400 cursor-pointer transition-colors truncate"
                          >
                            {project.name}
                          </h4>
                        </div>
                        {(project as any).forkedFrom && (
                          <div className="text-[10px] text-[#6b6b7a] mb-1 italic">
                            Forked from {(project as any).forkedFrom}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-[#6b6b7a] mb-4">
                          <Clock size={12} />
                          Last edited {project.lastModified}
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {project.techStack.map(tech => (
                              <TechIcon key={tech} type={tech} />
                            ))}
                          </div>
                          <div className="flex -space-x-2">
                            {project.teamMembers.slice(0, 3).map((member, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#141416] overflow-hidden bg-[#1c1c20]">
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {project.teamMembers.length > 3 && (
                              <div className="w-6 h-6 rounded-full border-2 border-[#141416] bg-[#1c1c20] flex items-center justify-center text-[8px] font-bold text-[#6b6b7a]">
                                +{project.teamMembers.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-[#2a2a30] px-4 py-2 flex items-center justify-between bg-[#0d0d0f]/50">
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                          project.mode === 'ide' ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        )}>
                          {project.mode}
                        </div>
                        
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors outline-none">
                              <MoreVertical size={16} />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content className="min-w-[160px] bg-[#1c1c20] border border-[#2a2a30] rounded-md p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                              <DropdownMenu.Item 
                                onClick={() => navigate(`/project/${project.id}`)}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
                              >
                                <ExternalLink size={14} /> Open
                              </DropdownMenu.Item>
                              <DropdownMenu.Item 
                                onClick={() => duplicateProject(project.id)}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
                              >
                                <Copy size={14} /> Duplicate
                              </DropdownMenu.Item>
                              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                                <Edit2 size={14} /> Rename
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
                              <DropdownMenu.Item 
                                onClick={() => archiveProject(project.id)}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
                              >
                                <Archive size={14} /> {project.isArchived ? 'Unarchive' : 'Archive'}
                              </DropdownMenu.Item>
                              <DropdownMenu.Item 
                                onClick={() => deleteProject(project.id)}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500 hover:text-white rounded cursor-pointer outline-none"
                              >
                                <Trash2 size={14} /> Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>
        <BillingModal 
          open={isBillingModalOpen} 
          onOpenChange={setBillingModalOpen} 
        />
      </main>
    </div>
  );
};
