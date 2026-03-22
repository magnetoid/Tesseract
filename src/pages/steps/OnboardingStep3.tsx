import React, { useState } from 'react';
import { Zap, Activity, Cpu, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../../components/shared/Input';

interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const MODES = [
  { id: 'turbo', label: 'Turbo', description: 'Fastest + cheapest', icon: Zap, color: 'text-info', bg: 'bg-info/10' },
  { id: 'balanced', label: 'Balanced', description: 'Smart routing', icon: Activity, color: 'text-accent', bg: 'bg-accent/10' },
  { id: 'max-power', label: 'Max Power', description: 'Best models', icon: Cpu, color: 'text-success', bg: 'bg-success/10' },
];

export function OnboardingStep3({ data, updateData, onNext, onBack }: StepProps) {
  const [mode, setMode] = useState(data.economyMode || 'balanced');
  const [showKeys, setShowKeys] = useState(false);
  const [keys, setKeys] = useState(data.apiKeys || { anthropic: '', openai: '', google: '' });

  const handleNext = () => {
    updateData({ economyMode: mode, apiKeys: keys });
    onNext();
  };

  return (
    <div className="space-y-8 flex flex-col h-full">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Set up your AI</h1>
        <p className="text-secondary text-sm">Choose how you want to power your agent.</p>
      </div>

      <div className="space-y-6 flex-1">
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all text-center group",
                mode === m.id 
                  ? "bg-accent/5 border-accent shadow-sm" 
                  : "bg-page border-default hover:border-accent/50 hover:bg-elevated/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                mode === m.id ? m.bg + " " + m.color : "bg-elevated text-tertiary group-hover:text-primary"
              )}>
                <m.icon size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-primary">{m.label}</div>
                <div className="text-[10px] text-tertiary mt-0.5">{m.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setShowKeys(!showKeys)}
            className="flex items-center justify-between w-full p-4 bg-elevated/30 border border-default rounded-2xl text-sm font-bold text-secondary hover:text-primary transition-all"
          >
            <div className="flex items-center gap-2">
              <Key size={16} className="text-accent" />
              Or bring your own API keys
            </div>
            {showKeys ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showKeys && (
            <div className="space-y-4 p-4 bg-elevated/10 border border-default rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-wider ml-1">Anthropic API Key</label>
                <Input 
                  type="password"
                  value={keys.anthropic}
                  onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                  placeholder="sk-ant-..."
                  className="h-10 bg-page border-default rounded-xl px-3 text-xs text-primary focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-wider ml-1">OpenAI API Key</label>
                <Input 
                  type="password"
                  value={keys.openai}
                  onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                  placeholder="sk-..."
                  className="h-10 bg-page border-default rounded-xl px-3 text-xs text-primary focus:border-accent transition-all"
                />
              </div>
              <p className="text-[10px] text-tertiary italic ml-1">You can always add these later in Settings.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onBack} 
          className="h-12 px-6 bg-page border border-default rounded-xl font-bold text-sm text-secondary hover:bg-elevated transition-all"
        >
          Back
        </button>
        <button 
          onClick={handleNext} 
          className="flex-1 h-12 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold text-sm shadow-lg shadow-accent/20 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
