import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Palette, 
  LayoutDashboard, 
  Server, 
  Gamepad2, 
  Sparkles, 
  Puzzle, 
  Plus, 
  ArrowUp, 
  RefreshCw, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useProjectStore, Project } from '../../stores/projectStore';
import { cn } from '../../lib/utils';

const PROJECT_TYPES = [
  { id: 'website', icon: Globe, label: 'Website', prompt: 'Build a modern landing page for a SaaS startup with a dark theme and glassmorphism effects.' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', prompt: 'Design a mobile-first fitness tracking app with interactive charts and a clean UI.' },
  { id: 'design', icon: Palette, label: 'Design', prompt: 'Create a design system for a creative agency, including color palettes and typography.' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', prompt: 'Build a real-time sales dashboard with data visualization using Recharts.' },
  { id: 'api', icon: Server, label: 'API', prompt: 'Develop a RESTful API for a task management system with user authentication.' },
  { id: 'game', icon: Gamepad2, label: 'Game', prompt: 'Create a simple 2D platformer game using HTML5 Canvas and React.' },
  { id: 'ai', icon: Sparkles, label: 'AI App', prompt: 'Build an AI-powered content generator using the Gemini API.' },
  { id: 'extension', icon: Puzzle, label: 'Extension', prompt: 'Develop a browser extension that helps users track their productivity.' },
];

const EXAMPLE_PROMPTS = [
  "Startup pitch deck",
  "Mobile app proposal",
  "Retail sales dashboard",
  "Personal portfolio site",
  "E-commerce storefront",
  "Task management app",
  "Weather forecast widget",
  "Social media feed",
  "Recipe generator",
  "Budget tracker",
  "Music player UI",
  "Chat application"
];

export function HomeContent() {
  const navigate = useNavigate();
  const { projects, addProject } = useProjectStore();
  const [prompt, setPrompt] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shufflePrompts();
  }, []);

  const shufflePrompts = () => {
    const shuffled = [...EXAMPLE_PROMPTS].sort(() => 0.5 - Math.random()).slice(0, 3);
    setShuffledPrompts(shuffled);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    const newId = Math.random().toString(36).substring(7);
    const newProject: Project = {
      id: newId,
      name: prompt.slice(0, 20) + '...',
      description: prompt,
      lastEdited: 'Just now',
      type: 'website', // Default
    };

    addProject(newProject);
    navigate(`/project/${newId}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-1 ml-[220px] overflow-y-auto bg-[#0a0a0c] h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Workspace Badge */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141416] border border-[#232328] rounded-full text-sm text-[#6b6b7a] cursor-pointer hover:border-[#7c6ff7]/30 transition-colors">
            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
              M
            </div>
            <span>Marko's Workspace</span>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Greeting */}
        <h1 className="text-3xl font-medium text-[#e8e8ed] text-center mt-6">
          Hi Marko, what do you want to make?
        </h1>

        {/* Chat Input */}
        <div className="max-w-2xl mx-auto mt-8">
          <form 
            onSubmit={handleSubmit}
            className="bg-[#141416] border border-[#232328] rounded-2xl p-3 focus-within:border-violet-500/30 transition-all shadow-xl"
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Describe your idea, Agent will bring it to life..."
              className="w-full bg-transparent border-none outline-none text-[#e8e8ed] text-base placeholder-[#44444d] resize-none min-h-[44px] max-h-[120px] py-1"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#232328]">
              <button type="button" className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-colors">
                <Plus size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6b6b7a]">Plan</span>
                  <button 
                    type="button"
                    onClick={() => setIsPlanning(!isPlanning)}
                    className={cn(
                      "w-8 h-4 rounded-full transition-colors relative",
                      isPlanning ? "bg-violet-500" : "bg-[#1c1c20]"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                      isPlanning ? "left-4.5" : "left-0.5"
                    )} />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!prompt.trim()}
                  className="w-8 h-8 bg-violet-500 hover:bg-violet-400 disabled:bg-[#1c1c20] disabled:text-[#44444d] text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Project Type Icons */}
        <div className="relative mt-10 group">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-[#141416] border border-[#232328] rounded-full flex items-center justify-center text-[#6b6b7a] hover:text-[#e8e8ed] opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <div 
            ref={scrollRef}
            className="flex justify-center gap-6 overflow-x-auto no-scrollbar px-4"
          >
            {PROJECT_TYPES.map((type) => (
              <button 
                key={type.id}
                onClick={() => setPrompt(type.prompt)}
                className="flex flex-col items-center gap-2 shrink-0 group/type"
              >
                <div className="w-14 h-14 bg-[#141416] border border-[#232328] rounded-xl flex items-center justify-center text-[#6b6b7a] group-hover/type:border-violet-500/50 group-hover/type:text-violet-500 transition-all">
                  <type.icon size={24} />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6b6b7a] group-hover/type:text-[#e8e8ed]">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-[#141416] border border-[#232328] rounded-full flex items-center justify-center text-[#6b6b7a] hover:text-[#e8e8ed] opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Example Prompts */}
        <div className="text-center mt-10">
          <div className="flex items-center justify-center gap-2 text-xs text-[#6b6b7a] mb-4">
            <span>Try an example prompt</span>
            <button onClick={shufflePrompts} className="hover:text-[#e8e8ed] transition-colors">
              <RefreshCw size={12} />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {shuffledPrompts.map((p) => (
              <button 
                key={p}
                onClick={() => setPrompt(p)}
                className="bg-[#141416] border border-[#232328] rounded-full px-4 py-1.5 text-sm text-[#6b6b7a] hover:text-[#e8e8ed] hover:border-violet-500/30 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mt-12 border-t border-[#232328] pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#e8e8ed]">Your recent Projects</h2>
            <Link to="/projects" className="text-sm text-[#6b6b7a] hover:text-violet-500 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <Link 
                key={project.id}
                to={`/project/${project.id}`}
                className="group bg-[#141416] border border-[#232328] rounded-xl overflow-hidden hover:border-violet-500/30 transition-all"
              >
                <div className="h-[120px] bg-[#0a0a0c] flex items-center justify-center p-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1c1c20] flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
                    {(() => {
                      const Icon = PROJECT_TYPES.find(t => t.id === project.type)?.icon || Globe;
                      return <Icon size={24} />;
                    })()}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-[#e8e8ed] truncate">{project.name}</h3>
                  <p className="text-xs text-[#6b6b7a] mt-1">Edited {project.lastEdited}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
