import React, { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ExternalLink,
  Cpu,
  Zap,
  CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export function ApiKeysTab() {
  const [useCredits, setUseCredits] = useState(true);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const providers = [
    { id: 'anthropic', name: 'Anthropic', desc: 'Claude 3.5 Opus, Sonnet, Haiku', status: 'valid' },
    { id: 'openai', name: 'OpenAI', desc: 'GPT-4o, GPT-4 Turbo, GPT-3.5', status: 'valid' },
    { id: 'google', name: 'Google AI', desc: 'Gemini 1.5 Pro, Flash', status: 'untested' },
    { id: 'deepseek', name: 'DeepSeek', desc: 'DeepSeek V3, Coder', status: 'invalid' },
    { id: 'openrouter', name: 'OpenRouter', desc: 'Access 100+ models via one API', status: 'untested' },
    { id: 'ollama', name: 'Ollama', desc: 'Local models (Llama 3, Mistral)', status: 'untested', isLocal: true },
  ];

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTest = (name: string) => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: `Testing ${name} connection...`,
      success: `${name} API key is valid!`,
      error: `Failed to connect to ${name}.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Master Toggle */}
      <div className="p-6 bg-surface border border-default rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <CreditCard size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-primary">Use Torsor Credits</div>
              <div className="text-xs text-secondary mt-0.5">Use our managed credit pool instead of your own keys.</div>
            </div>
          </div>
          <Switch.Root 
            checked={useCredits} 
            onCheckedChange={setUseCredits}
            className="w-12 h-6 bg-elevated rounded-full relative data-[state=checked]:bg-accent transition-colors outline-none cursor-pointer"
          >
            <Switch.Thumb className="block w-4.5 h-4.5 bg-white rounded-full transition-transform duration-100 translate-x-1 data-[state=checked]:translate-x-6.5" />
          </Switch.Root>
        </div>

        {useCredits && (
          <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <Zap className="text-accent" size={20} />
              <div className="text-sm font-medium text-primary">Using Torsor credit pool.</div>
            </div>
            <div className="text-sm font-bold text-accent">Balance: 47,200 tokens</div>
          </div>
        )}
      </div>

      {/* Provider Keys */}
      <div className={cn("space-y-4", useCredits && "opacity-50 pointer-events-none grayscale")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="text-accent" size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Provider Keys</h3>
          </div>
          <button className="text-xs font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider">
            Clear all keys
          </button>
        </div>

        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="p-4 bg-surface border border-default rounded-2xl space-y-4 group hover:border-accent/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center text-secondary group-hover:text-accent transition-colors">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">{provider.name}</div>
                    <div className="text-xs text-secondary">{provider.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    provider.status === 'valid' ? "bg-success/10 text-success" :
                    provider.status === 'invalid' ? "bg-error/10 text-error" :
                    "bg-elevated text-tertiary"
                  )}>
                    {provider.status === 'valid' && <CheckCircle2 size={10} />}
                    {provider.status === 'invalid' && <AlertCircle size={10} />}
                    {provider.status}
                  </div>
                  <button className="p-2 hover:bg-elevated rounded-lg text-tertiary hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input 
                    type={showKeys[provider.id] ? "text" : "password"} 
                    placeholder={provider.isLocal ? "http://localhost:11434" : "sk-••••••••••••••••"}
                    className="w-full bg-page border border-default rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-accent transition-colors font-mono"
                  />
                  {!provider.isLocal && (
                    <button 
                      onClick={() => toggleShowKey(provider.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                    >
                      {showKeys[provider.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => handleTest(provider.name)}
                  className="px-4 py-2 bg-elevated border border-default rounded-xl text-xs font-bold text-primary hover:bg-surface transition-all"
                >
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-4 border-2 border-dashed border-default rounded-2xl text-tertiary hover:text-accent hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-bold text-sm">
          <Plus size={18} />
          Add Custom Provider
        </button>
      </div>
    </div>
  );
}
