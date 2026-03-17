import React, { useState } from 'react';
import { Check, Sword, Zap, Clock, Database, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModelComparisonProps {
  models: {
    name: string;
    dotColor: string;
    content: string;
    metrics: { time: string; tokens: string; cost: string };
  }[];
  onSelect?: (modelName: string) => void;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ models, onSelect }) => {
  const [winner, setWinner] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleSelect = (name: string) => {
    setWinner(name);
    onSelect?.(name);
  };

  const toggleExpand = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="my-4 bg-[#141416] rounded-xl border border-[#2a2a30] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a2a30] bg-[#1c1c20]">
        <Sword size={16} className="text-violet-400" />
        <span className="text-sm font-bold text-[#e8e8ed]">Model Comparison</span>
      </div>
      
      <div className="flex overflow-x-auto scrollbar-hide">
        {models.map((model) => (
          <div 
            key={model.name}
            className={cn(
              "min-w-[280px] flex-1 border-r border-[#2a2a30] last:border-r-0 transition-all duration-300",
              winner === model.name ? "bg-violet-500/5 ring-2 ring-inset ring-violet-500/50" : ""
            )}
          >
            {/* Header */}
            <div className="p-3 border-b border-[#2a2a30] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", model.dotColor)} />
                <span className="text-xs font-bold text-[#e8e8ed]">{model.name}</span>
              </div>
              {winner === model.name && (
                <div className="bg-violet-500 text-white p-0.5 rounded-full">
                  <Check size={12} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 relative">
              <div className={cn(
                "text-xs text-[#e8e8ed] font-mono leading-relaxed overflow-hidden transition-all duration-300",
                expanded[model.name] ? "max-h-[800px]" : "max-h-[200px]"
              )}>
                {model.content}
                {!expanded[model.name] && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#141416] to-transparent" />
                )}
              </div>
              <button 
                onClick={() => toggleExpand(model.name)}
                className="mt-2 text-[10px] font-bold text-violet-400 hover:text-violet-300 uppercase tracking-wider"
              >
                {expanded[model.name] ? 'Show Less' : 'Show More'}
              </button>
            </div>

            {/* Metrics */}
            <div className="px-4 py-3 bg-[#0d0d0f]/50 border-t border-[#2a2a30] space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-[#6b6b7a]">
                  <Clock size={10} />
                  <span>Time</span>
                </div>
                <span className="text-[#e8e8ed]">{model.metrics.time}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-[#6b6b7a]">
                  <Database size={10} />
                  <span>Tokens</span>
                </div>
                <span className="text-[#e8e8ed]">{model.metrics.tokens}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-[#6b6b7a]">
                  <DollarSign size={10} />
                  <span>Cost</span>
                </div>
                <span className="text-[#e8e8ed]">{model.metrics.cost}</span>
              </div>
            </div>

            {/* Action */}
            <div className="p-3">
              <button
                onClick={() => handleSelect(model.name)}
                disabled={winner !== null}
                className={cn(
                  "w-full py-2 rounded-lg text-xs font-bold transition-all",
                  winner === model.name 
                    ? "bg-violet-500 text-white" 
                    : winner !== null 
                      ? "bg-[#1c1c20] text-[#6b6b7a] cursor-not-allowed"
                      : "bg-[#1c1c20] text-[#e8e8ed] hover:bg-[#2a2a30]"
                )}
              >
                {winner === model.name ? 'Selected' : 'Use This'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
