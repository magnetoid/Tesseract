import React, { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { 
  Sparkles, 
  Code2, 
  Terminal, 
  Database, 
  Package, 
  GitBranch, 
  Rocket, 
  ShieldCheck, 
  Image, 
  Globe, 
  Files, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  BarChart3,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  canDisable: boolean;
  uses: number;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: 'code-gen', name: 'Code generation', description: 'Write and modify code files.', icon: <Code2 size={18} />, enabled: true, canDisable: false, uses: 24 },
  { id: 'terminal', name: 'Terminal access', description: 'Run shell commands.', icon: <Terminal size={18} />, enabled: true, canDisable: true, uses: 12 },
  { id: 'database', name: 'Database management', description: 'Create tables, run migrations, query data.', icon: <Database size={18} />, enabled: true, canDisable: true, uses: 8 },
  { id: 'package', name: 'Package management', description: 'Install and manage npm/pip packages.', icon: <Package size={18} />, enabled: true, canDisable: true, uses: 5 },
  { id: 'git', name: 'Git operations', description: 'Commit, push, branch, merge.', icon: <GitBranch size={18} />, enabled: true, canDisable: true, uses: 15 },
  { id: 'deploy', name: 'Deploy', description: 'Deploy to Vercel, Netlify, or custom servers.', icon: <Rocket size={18} />, enabled: true, canDisable: true, uses: 3 },
  { id: 'security', name: 'Security scanning', description: 'Scan for vulnerabilities and fix them.', icon: <ShieldCheck size={18} />, enabled: true, canDisable: true, uses: 2 },
  { id: 'image', name: 'Image analysis', description: 'Understand screenshots and Figma designs.', icon: <Image size={18} />, enabled: true, canDisable: true, uses: 4 },
  { id: 'web-search', name: 'Web search', description: 'Search the web for documentation and solutions.', icon: <Globe size={18} />, enabled: true, canDisable: true, uses: 18 },
  { id: 'file-mgmt', name: 'File management', description: 'Create, delete, rename, organize files.', icon: <Files size={18} />, enabled: true, canDisable: true, uses: 32 },
];

interface CustomSkill {
  id: string;
  name: string;
  description: string;
  instruction: string;
}

export default function AgentSkillsTab() {
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<CustomSkill, 'id'>>({
    name: '',
    description: '',
    instruction: ''
  });

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => 
      s.id === id && s.canDisable ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const addCustomSkill = () => {
    if (!newSkill.name || !newSkill.instruction) return;
    setCustomSkills(prev => [...prev, { ...newSkill, id: `custom-${Date.now()}` }]);
    setNewSkill({ name: '', description: '', instruction: '' });
    setIsAddingSkill(false);
  };

  const removeCustomSkill = (id: string) => {
    setCustomSkills(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] overflow-y-auto no-scrollbar">
      {/* HEADER */}
      <div className="h-12 bg-[#141416] flex items-center justify-between px-4 shrink-0 border-b border-[#232328] sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-violet-400" />
          <h2 className="text-sm font-bold text-[#e8e8ed]">Agent Skills</h2>
        </div>
        <button 
          onClick={() => setIsAddingSkill(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-violet-400 transition-colors shadow-lg shadow-violet-500/20"
        >
          <Plus size={14} />
          Add Skill
        </button>
      </div>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-8">
        {/* DEFAULT SKILLS */}
        <section>
          <h3 className="text-xs font-bold text-[#6b6b7a] uppercase tracking-widest mb-4">Core Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className={cn(
                  "bg-[#141416] rounded-xl border border-[#232328] p-4 flex items-center justify-between transition-all",
                  !skill.enabled && "opacity-50 grayscale"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg bg-[#0a0a0c] border border-[#232328]",
                    skill.enabled ? "text-violet-400" : "text-[#44444d]"
                  )}>
                    {skill.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#e8e8ed] mb-0.5">{skill.name}</h4>
                    <p className="text-[11px] text-[#6b6b7a] leading-tight">{skill.description}</p>
                  </div>
                </div>
                <Switch.Root 
                  checked={skill.enabled}
                  onCheckedChange={() => toggleSkill(skill.id)}
                  disabled={!skill.canDisable}
                  className={cn(
                    "w-8 h-4 rounded-full relative transition-colors outline-none cursor-pointer disabled:cursor-not-allowed",
                    skill.enabled ? "bg-violet-500" : "bg-[#232328]"
                  )}
                >
                  <Switch.Thumb className="block w-3 h-3 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            ))}
          </div>
        </section>

        {/* CUSTOM SKILLS */}
        <section>
          <h3 className="text-xs font-bold text-[#6b6b7a] uppercase tracking-widest mb-4">Custom Instructions</h3>
          <div className="space-y-3">
            {customSkills.map((skill) => (
              <div 
                key={skill.id}
                className="bg-[#141416] rounded-xl border border-[#232328] p-4 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-[#e8e8ed]">{skill.name}</h4>
                  </div>
                  <button 
                    onClick={() => removeCustomSkill(skill.id)}
                    className="p-1 text-[#44444d] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-[#6b6b7a] mb-3">{skill.description}</p>
                <div className="bg-[#0a0a0c] rounded-lg p-3 border border-[#232328] font-mono text-[11px] text-violet-400/80 italic">
                  "{skill.instruction}"
                </div>
              </div>
            ))}

            {isAddingSkill ? (
              <div className="bg-[#141416] rounded-xl border border-violet-500/30 p-5 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">New Custom Skill</h4>
                  <button onClick={() => setIsAddingSkill(false)} className="text-[#6b6b7a] hover:text-[#e8e8ed]">
                    <Plus size={16} className="rotate-45" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Skill Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Zod Validation"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg px-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Description</label>
                    <input 
                      type="text" 
                      placeholder="What does this skill do?"
                      value={newSkill.description}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg px-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Instruction (System Prompt Addition)</label>
                    <textarea 
                      placeholder="When building forms, always use Zod for validation..."
                      value={newSkill.instruction}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, instruction: e.target.value }))}
                      className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg px-3 py-2 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50 min-h-[80px] resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setIsAddingSkill(false)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#232328] text-[#e8e8ed] text-[10px] font-bold uppercase tracking-wider hover:bg-[#232328] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addCustomSkill}
                    className="flex-1 px-3 py-2 rounded-lg bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-violet-400 transition-colors shadow-lg shadow-violet-500/20"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingSkill(true)}
                className="w-full h-24 rounded-xl border border-dashed border-[#232328] hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#141416] border border-[#232328] flex items-center justify-center group-hover:bg-violet-500 group-hover:border-violet-400 transition-colors">
                  <Plus size={16} className="text-[#6b6b7a] group-hover:text-white" />
                </div>
                <span className="text-xs font-medium text-[#6b6b7a] group-hover:text-violet-400">Add custom skill</span>
              </button>
            )}
          </div>
        </section>

        {/* USAGE STATS */}
        <section className="bg-[#141416] rounded-2xl border border-[#232328] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-violet-400" />
              <h3 className="text-xs font-bold text-[#e8e8ed] uppercase tracking-widest">Skill Usage (This Session)</h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#6b6b7a]">
              <Info size={12} />
              <span>Updated in real-time</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skills.filter(s => s.uses > 10).map(skill => (
              <div key={skill.id} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-[#6b6b7a]">{skill.name}</span>
                  <span className="text-violet-400">{skill.uses}</span>
                </div>
                <div className="h-1 w-full bg-[#0a0a0c] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500" 
                    style={{ width: `${(skill.uses / 40) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-[#6b6b7a]">Total Actions</span>
                <span className="text-emerald-400">121</span>
              </div>
              <div className="h-1 w-full bg-[#0a0a0c] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[75%]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
