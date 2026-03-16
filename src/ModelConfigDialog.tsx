import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import { X, Check, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useAppStore, AgentRole } from './useAppStore';

const ROLES: { id: AgentRole; name: string; desc: string }[] = [
  { id: 'orchestrator', name: 'Orchestrator', desc: 'Breaks down tasks and coordinates other agents.' },
  { id: 'architect', name: 'Architect', desc: 'Designs system architecture and component hierarchy.' },
  { id: 'executor', name: 'Executor', desc: 'Sets up environment and runs terminal commands.' },
  { id: 'reasoner', name: 'Reasoner', desc: 'Handles complex algorithmic and logic tasks.' },
  { id: 'worker', name: 'Worker', desc: 'Implements React components and UI features.' },
  { id: 'scout', name: 'Scout', desc: 'Researches documentation and external APIs.' },
];

const MODELS = [
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'gpt-5', name: 'GPT-5.3 Codex' },
  { id: 'deepseek-reasoner', name: 'DeepSeek R1' },
  { id: 'deepseek-worker', name: 'DeepSeek V3.2' },
  { id: 'kimi-k2', name: 'Kimi K2 Thinking' },
  { id: 'qwen3-coder', name: 'Qwen 3 Coder' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
];

export default function ModelConfigDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState('models');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  
  // Local state for edits before saving
  const activeModels = useAppStore(state => state.activeModels);
  const apiKeys = useAppStore(state => state.apiKeys);
  const setApiKeys = useAppStore(state => state.setApiKeys);
  
  const [localModels, setLocalModels] = useState(activeModels);
  const [localApiKeys, setLocalApiKeys] = useState<Record<string, string>>(apiKeys);
  
  const handleSave = () => {
    useAppStore.setState({ activeModels: localModels });
    setApiKeys(localApiKeys);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#2a2a30] bg-[#141416] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl overflow-hidden flex h-[600px]">
          
          {/* Sidebar Nav */}
          <div className="w-48 bg-[#0d0d0f] border-r border-[#2a2a30] p-4 flex flex-col">
            <h2 className="text-sm font-semibold text-[#e8e8ed] mb-4 px-2">Settings</h2>
            <div className="flex flex-col gap-1">
              {['Models', 'Parallelism', 'API Keys', 'Shortcuts'].map((tab) => {
                const id = tab.toLowerCase().replace(' ', '-');
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeTab === id 
                        ? 'bg-violet-500/20 text-violet-300 font-medium' 
                        : 'text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a30]">
              <Dialog.Title className="text-lg font-semibold text-[#e8e8ed]">
                {activeTab === 'models' && 'Agent Models'}
                {activeTab === 'parallelism' && 'Parallelism Settings'}
                {activeTab === 'api-keys' && 'API Keys'}
                {activeTab === 'shortcuts' && 'Keyboard Shortcuts'}
              </Dialog.Title>
              <Dialog.Close className="text-[#6b6b7a] hover:text-[#e8e8ed] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X size={18} />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'models' && (
                <div className="flex flex-col gap-4">
                  {ROLES.map((role) => (
                    <div key={role.id} className="flex items-start justify-between p-4 rounded-lg border border-[#2a2a30] bg-[#1c1c20]">
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium text-[#e8e8ed]">{role.name}</h3>
                          <Switch.Root className="w-8 h-4 bg-[#2a2a30] rounded-full relative data-[state=checked]:bg-violet-500 outline-none cursor-default" defaultChecked>
                            <Switch.Thumb className="block w-3 h-3 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
                          </Switch.Root>
                        </div>
                        <p className="text-xs text-[#6b6b7a]">{role.desc}</p>
                      </div>
                      
                      <div className="w-64 flex flex-col gap-3">
                        <Select.Root 
                          value={localModels[role.id]} 
                          onValueChange={(val) => setLocalModels(prev => ({ ...prev, [role.id]: val }))}
                        >
                          <Select.Trigger className="inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-[#0d0d0f] text-[#e8e8ed] border border-[#2a2a30] hover:bg-[#2a2a30] focus:outline-none data-[placeholder]:text-[#6b6b7a] outline-none">
                            <Select.Value />
                            <Select.Icon className="text-[#6b6b7a]">
                              <ChevronDown size={14} />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="overflow-hidden bg-[#1c1c20] rounded-md border border-[#2a2a30] shadow-xl z-[100]">
                              <Select.Viewport className="p-[5px]">
                                {MODELS.map(model => (
                                  <Select.Item key={model.id} value={model.id} className="text-[13px] leading-none text-[#e8e8ed] rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-[#6b6b7a] data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet-500/20 data-[highlighted]:text-violet-300 cursor-pointer">
                                    <Select.ItemText>{model.name}</Select.ItemText>
                                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                                      <Check size={14} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs text-[#6b6b7a]">
                            <span>Token Budget</span>
                            <span>8k</span>
                          </div>
                          <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" defaultValue={[8]} max={128} step={1}>
                            <Slider.Track className="bg-[#2a2a30] relative grow rounded-full h-[3px]">
                              <Slider.Range className="absolute bg-violet-500 rounded-full h-full" />
                            </Slider.Track>
                            <Slider.Thumb className="block w-3 h-3 bg-white shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] hover:bg-violet-100 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet-500" />
                          </Slider.Root>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'parallelism' && (
                <div className="flex flex-col gap-6 max-w-md">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-[#e8e8ed]">Max Concurrent Agents</label>
                    <p className="text-xs text-[#6b6b7a] mb-2">Limit how many agents can run simultaneously to manage API rate limits.</p>
                    <div className="flex items-center gap-4">
                      <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" defaultValue={[3]} max={6} min={1} step={1}>
                        <Slider.Track className="bg-[#2a2a30] relative grow rounded-full h-[3px]">
                          <Slider.Range className="absolute bg-violet-500 rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-4 h-4 bg-white shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] hover:bg-violet-100 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet-500" />
                      </Slider.Root>
                      <span className="text-sm font-medium text-[#e8e8ed] w-4 text-center">3</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a30]">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#e8e8ed]">Auto-Route Tasks</label>
                      <p className="text-xs text-[#6b6b7a]">Automatically assign tasks to the best suited agent.</p>
                    </div>
                    <Switch.Root className="w-10 h-5 bg-[#2a2a30] rounded-full relative data-[state=checked]:bg-violet-500 outline-none cursor-default" defaultChecked>
                      <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                    </Switch.Root>
                  </div>
                </div>
              )}

              {activeTab === 'api-keys' && (
                <div className="flex flex-col gap-4 max-w-lg">
                  <p className="text-sm text-[#6b6b7a] mb-2">Keys are stored locally in your browser and never sent to our servers.</p>
                  
                  {['Anthropic', 'OpenAI', 'DeepSeek', 'Google'].map((provider) => (
                    <div key={provider} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#e8e8ed]">{provider} API Key</label>
                      <div className="relative">
                        <input 
                          type={showKeys[provider] ? 'text' : 'password'} 
                          placeholder={`sk-...`}
                          value={localApiKeys[provider] || ''}
                          onChange={(e) => setLocalApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                          className="w-full bg-[#1c1c20] border border-[#2a2a30] rounded-md px-3 py-2 text-sm text-[#e8e8ed] focus:outline-none focus:border-violet-500 pr-10"
                        />
                        <button 
                          onClick={() => setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b6b7a] hover:text-[#e8e8ed] p-1"
                        >
                          {showKeys[provider] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shortcuts' && (
                <div className="flex flex-col gap-2 max-w-md">
                  {[
                    { label: 'Toggle Builder/IDE Mode', keys: ['⌘', 'B'] },
                    { label: 'Run / Build', keys: ['⌘', 'Enter'] },
                    { label: 'Open Command Palette', keys: ['⌘', 'K'] },
                    { label: 'Open Settings', keys: ['⌘', ','] },
                    { label: 'Close Dialogs', keys: ['Esc'] },
                  ].map((shortcut, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#2a2a30] last:border-0">
                      <span className="text-sm text-[#e8e8ed]">{shortcut.label}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((k, j) => (
                          <kbd key={j} className="bg-[#1c1c20] border border-[#2a2a30] rounded px-2 py-0.5 text-xs text-[#6b6b7a] font-mono shadow-sm">
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#2a2a30] flex justify-end gap-3 bg-[#0d0d0f]">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm font-medium text-[#e8e8ed] hover:bg-[#2a2a30] rounded-md transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-md transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
