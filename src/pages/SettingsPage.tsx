import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { 
  User, 
  Sparkles, 
  Key, 
  CreditCard, 
  Github, 
  Mail, 
  Check, 
  Zap, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import { HomeSidebar } from '../components/shell/HomeSidebar';
import { cn } from '../lib/utils';

export function SettingsPage() {
  const [economyMode, setEconomyMode] = useState<'turbo' | 'balanced' | 'max'>('balanced');
  const [planningEnabled, setPlanningEnabled] = useState(true);

  return (
    <div className="flex bg-[#0a0a0c] min-h-screen">
      <HomeSidebar />
      
      <main className="flex-1 ml-[220px] overflow-y-auto h-screen">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-[#e8e8ed] mb-8">Settings</h1>

          <Tabs.Root defaultValue="profile" className="flex flex-col">
            <Tabs.List className="flex gap-6 border-b border-[#232328] mb-8">
              {['profile', 'agent', 'api-keys', 'billing'].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "pb-3 text-sm font-medium capitalize transition-colors relative outline-none",
                    "data-[state=active]:text-[#e8e8ed] data-[state=inactive]:text-[#6b6b7a] hover:text-[#e8e8ed]"
                  )}
                >
                  {tab.replace('-', ' ')}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 scale-x-0 transition-transform data-[state=active]:scale-x-100" />
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-violet-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-[#141416]">
                  M
                </div>
                <div>
                  <button className="bg-[#1c1c20] border border-[#232328] rounded-lg px-4 py-1.5 text-sm text-[#e8e8ed] hover:bg-[#232328] transition-colors">
                    Change Avatar
                  </button>
                  <p className="text-xs text-[#6b6b7a] mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#6b6b7a] uppercase tracking-wider">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="Marko Tiosavljevic"
                    className="w-full bg-[#141416] border border-[#232328] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#6b6b7a] uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      defaultValue="marko.tiosavljevic@gmail.com"
                      readOnly
                      className="w-full bg-[#0a0a0c] border border-[#232328] rounded-lg px-3 py-2 text-sm text-[#44444d] outline-none cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase">
                      <Check size={12} />
                      Verified
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#232328]">
                <h3 className="text-sm font-medium text-[#e8e8ed]">Connected Accounts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#141416] border border-[#232328] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Github size={20} className="text-[#e8e8ed]" />
                      <div>
                        <div className="text-sm font-medium text-[#e8e8ed]">GitHub</div>
                        <div className="text-xs text-[#6b6b7a]">Connected as @markotio</div>
                      </div>
                    </div>
                    <button className="text-xs text-[#6b6b7a] hover:text-red-500 transition-colors">Disconnect</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#141416] border border-[#232328] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-[#e8e8ed]" />
                      <div>
                        <div className="text-sm font-medium text-[#e8e8ed]">Google</div>
                        <div className="text-xs text-[#6b6b7a]">Connected as marko.tiosavljevic@gmail.com</div>
                      </div>
                    </div>
                    <button className="text-xs text-[#6b6b7a] hover:text-red-500 transition-colors">Disconnect</button>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="agent" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#e8e8ed]">Economy Mode</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'turbo', icon: Zap, label: 'Turbo', desc: 'Fastest + cheapest. Best for simple tasks.', price: '~$0.01/task' },
                    { id: 'balanced', icon: Activity, label: 'Balanced', desc: 'Smart routing per task complexity.', price: '~$0.05/task' },
                    { id: 'max', icon: ShieldCheck, label: 'Max Power', desc: 'Best models + consensus validation.', price: '~$0.15/task' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setEconomyMode(mode.id as any)}
                      className={cn(
                        "flex flex-col p-4 rounded-xl border text-left transition-all",
                        economyMode === mode.id 
                          ? "bg-violet-500/10 border-violet-500 ring-1 ring-violet-500" 
                          : "bg-[#141416] border-[#232328] hover:border-[#7c6ff7]/30"
                      )}
                    >
                      <mode.icon size={20} className={cn(economyMode === mode.id ? "text-violet-500" : "text-[#6b6b7a]")} />
                      <div className="mt-3 font-medium text-sm text-[#e8e8ed]">{mode.label}</div>
                      <div className="mt-1 text-xs text-[#6b6b7a] leading-relaxed">{mode.desc}</div>
                      <div className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-wider text-violet-500">{mode.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#141416] border border-[#232328] rounded-xl">
                <div>
                  <div className="text-sm font-medium text-[#e8e8ed]">Planning Mode</div>
                  <div className="text-xs text-[#6b6b7a] mt-1">Agent will show a plan for approval before writing code.</div>
                </div>
                <button 
                  onClick={() => setPlanningEnabled(!planningEnabled)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative",
                    planningEnabled ? "bg-violet-500" : "bg-[#1c1c20]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    planningEnabled ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#e8e8ed]">Model Array</h3>
                <div className="space-y-2">
                  {['Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 1.5 Pro', 'DeepSeek V3', 'Llama 3.1 405B'].map((model) => (
                    <div key={model} className="flex items-center justify-between p-3 bg-[#141416] border border-[#232328] rounded-xl">
                      <span className="text-sm text-[#e8e8ed]">{model}</span>
                      <div className="w-8 h-4 rounded-full bg-violet-500 relative">
                        <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="api-keys" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-500 leading-relaxed">
                  API keys are stored locally in your browser and never sent to our servers. 
                  They are used only to authenticate requests to model providers.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { provider: 'Anthropic', key: 'sk-ant-••••••••••••••••' },
                  { provider: 'OpenAI', key: 'sk-••••••••••••••••' },
                  { provider: 'Google AI', key: '••••••••••••••••' },
                  { provider: 'DeepSeek', key: 'ds-••••••••••••••••' },
                ].map((item) => (
                  <div key={item.provider} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-[#6b6b7a] uppercase tracking-wider">{item.provider} API Key</label>
                      <button className="text-[10px] font-bold uppercase text-violet-500 hover:text-violet-400 transition-colors">Test Connection</button>
                    </div>
                    <div className="relative">
                      <input 
                        type="password" 
                        defaultValue={item.key}
                        className="w-full bg-[#141416] border border-[#232328] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] outline-none focus:border-violet-500/50 transition-colors"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b7a] hover:text-[#e8e8ed]">Show</button>
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-sm text-violet-500 hover:text-violet-400 font-medium transition-colors pt-2">
                  <Plus size={16} />
                  <span>Add another provider</span>
                </button>
              </div>
            </Tabs.Content>

            <Tabs.Content value="billing" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Current Plan</div>
                  <div className="text-3xl font-bold mt-1">Free Tier</div>
                  <p className="text-sm mt-3 opacity-90 max-w-md">
                    You're currently on the free plan. Upgrade to Pro to unlock unlimited agent tasks, 
                    custom model routing, and priority cloud deployments.
                  </p>
                  <button className="bg-white text-violet-600 px-6 py-2 rounded-xl font-bold text-sm mt-6 hover:bg-opacity-90 transition-all shadow-lg">
                    Upgrade to Pro — $20/mo
                  </button>
                </div>
                <Sparkles className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10 rotate-12" />
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-medium text-[#e8e8ed]">Usage Statistics</h3>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#e8e8ed]">Free Projects</span>
                      <span className="text-[#6b6b7a]">3 / 10 projects</span>
                    </div>
                    <div className="h-2 w-full bg-[#141416] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 w-[30%]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#e8e8ed]">Agent Tasks</span>
                      <span className="text-[#6b6b7a]">124 / 1,000 tasks</span>
                    </div>
                    <div className="h-2 w-full bg-[#141416] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 w-[12.4%]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#e8e8ed]">Cloud Deployments</span>
                      <span className="text-[#6b6b7a]">0 / 3 deployments</span>
                    </div>
                    <div className="h-2 w-full bg-[#141416] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 w-0" />
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </main>
    </div>
  );
}
