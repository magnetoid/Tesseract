import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { 
  Github, 
  Database, 
  CreditCard, 
  Cloud, 
  Globe, 
  Mail, 
  MessageSquare, 
  Flame, 
  Layers, 
  Zap,
  Search,
  Check,
  ExternalLink,
  Settings,
  X,
  ShieldCheck,
  Key
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  color: string;
}

const INTEGRATIONS: Integration[] = [
  { id: 'github', name: 'GitHub', description: 'Sync code and manage pull requests.', icon: <Github size={24} />, connected: true, color: 'text-white' },
  { id: 'supabase', name: 'Supabase', description: 'PostgreSQL database and authentication.', icon: <Database size={24} />, connected: true, color: 'text-emerald-400' },
  { id: 'stripe', name: 'Stripe', description: 'Accept payments and manage subscriptions.', icon: <CreditCard size={24} />, connected: false, color: 'text-blue-400' },
  { id: 'vercel', name: 'Vercel', description: 'Deploy and host your web applications.', icon: <Cloud size={24} />, connected: false, color: 'text-white' },
  { id: 'netlify', name: 'Netlify', description: 'Automated builds and serverless functions.', icon: <Globe size={24} />, connected: false, color: 'text-cyan-400' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery and marketing campaigns.', icon: <Mail size={24} />, connected: false, color: 'text-blue-500' },
  { id: 'twilio', name: 'Twilio', description: 'SMS, voice, and messaging APIs.', icon: <MessageSquare size={24} />, connected: false, color: 'text-red-500' },
  { id: 'firebase', name: 'Firebase', description: 'Google backend-as-a-service platform.', icon: <Flame size={24} />, connected: false, color: 'text-amber-500' },
  { id: 'planetscale', name: 'PlanetScale', description: 'Serverless MySQL database platform.', icon: <Layers size={24} />, connected: false, color: 'text-white' },
  { id: 'resend', name: 'Resend', description: 'Modern email API for developers.', icon: <Zap size={24} />, connected: false, color: 'text-white' },
];

export default function IntegrationsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedIds, setConnectedIds] = useState<string[]>(['github', 'supabase']);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const filteredIntegrations = INTEGRATIONS.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (id: string) => {
    setIsConnecting(id);
    // Simulate connection process
    setTimeout(() => {
      setConnectedIds(prev => [...prev, id]);
      setIsConnecting(null);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0c] overflow-hidden">
      {/* HEADER */}
      <div className="h-12 bg-[#141416] flex items-center justify-between px-4 shrink-0 border-b border-[#232328]">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-violet-400" />
          <h2 className="text-sm font-bold text-[#e8e8ed]">Integrations</h2>
        </div>
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44444d]" />
          <input 
            type="text" 
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredIntegrations.map((item) => {
            const isConnected = connectedIds.includes(item.id);
            const connecting = isConnecting === item.id;

            return (
              <div 
                key={item.id}
                className="bg-[#141416] rounded-xl border border-[#232328] p-4 hover:border-[#44444d] transition-all group relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className={cn(
                  "absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity",
                  item.color.replace('text-', 'bg-')
                )} />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={cn("p-2 rounded-lg bg-[#0a0a0c] border border-[#232328]", item.color)}>
                    {item.icon}
                  </div>
                  {isConnected ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">
                      <Check size={10} />
                      Connected
                    </div>
                  ) : (
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button className="px-3 py-1 rounded-lg bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-violet-400 transition-colors shadow-lg shadow-violet-500/20">
                          Connect
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content 
                          className="w-72 bg-[#1c1c20] border border-[#232328] rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
                          sideOffset={8}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Settings size={14} className="text-violet-400" />
                              <span className="text-xs font-bold text-[#e8e8ed]">Configure {item.name}</span>
                            </div>
                            <Popover.Close className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] rounded transition-colors">
                              <X size={14} />
                            </Popover.Close>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">API Key</label>
                              <div className="relative">
                                <Key size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#44444d]" />
                                <input 
                                  type="password" 
                                  placeholder="sk_test_..."
                                  className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Project ID</label>
                              <input 
                                type="text" 
                                placeholder="my-awesome-project"
                                className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg px-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button className="flex-1 px-3 py-1.5 rounded-lg border border-[#232328] text-[#e8e8ed] text-[10px] font-bold uppercase tracking-wider hover:bg-[#232328] transition-colors">
                                Test
                              </button>
                              <button 
                                onClick={() => handleConnect(item.id)}
                                disabled={connecting}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-violet-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {connecting ? <Zap size={12} className="animate-pulse" /> : 'Save'}
                              </button>
                            </div>
                          </div>
                          <Popover.Arrow className="fill-[#232328]" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-[#e8e8ed] mb-1">{item.name}</h3>
                  <p className="text-xs text-[#6b6b7a] leading-relaxed mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#232328]">
                    <div className="flex items-center gap-1 text-[10px] text-[#44444d]">
                      <ShieldCheck size={12} />
                      <span>Official</span>
                    </div>
                    <a href="#" className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium">
                      Docs
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
