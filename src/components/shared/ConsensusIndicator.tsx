import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { useAppStore } from '../../useAppStore';
import { cn } from '../../lib/utils';

export const ConsensusIndicator: React.FC = () => {
  const consensusState = useAppStore(state => state.consensusState);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!consensusState || !consensusState.active) return null;

  const { status, agreement, models, diff } = consensusState;

  return (
    <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div 
        className={cn(
          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
          status === 'running' ? "bg-[#141416] border-[#2a2a30]" :
          status === 'agreed' ? "bg-emerald-500/10 border-emerald-500/20" :
          "bg-amber-500/10 border-amber-500/20"
        )}
        onClick={() => status !== 'running' && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {status === 'running' ? (
            <Brain size={18} className="text-violet-400 animate-pulse" />
          ) : status === 'agreed' ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={18} className="text-amber-400" />
          )}
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#e8e8ed]">
              {status === 'running' && `Running consensus: ${models.join(' + ')}`}
              {status === 'agreed' && `Both models agree (${agreement}% confidence)`}
              {status === 'disagreed' && `Models disagree (${agreement}% confidence) — using ${models[0]} output`}
            </span>
            {status === 'running' && (
              <span className="text-[10px] text-[#6b6b7a] uppercase tracking-wider font-bold">
                Analyzing outputs...
              </span>
            )}
          </div>
        </div>

        {status !== 'running' && (
          <div className="text-[#6b6b7a]">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </div>

      {isExpanded && diff && (
        <div className="mt-2 grid grid-cols-2 gap-2 animate-in zoom-in-95 duration-200">
          <div className="bg-[#0d0d0f] border border-[#2a2a30] rounded-lg p-3">
            <div className="text-[10px] font-bold text-[#6b6b7a] uppercase mb-2">{models[0]}</div>
            <pre className="text-xs text-emerald-400/80 font-mono whitespace-pre-wrap">
              {diff.left}
            </pre>
          </div>
          <div className="bg-[#0d0d0f] border border-[#2a2a30] rounded-lg p-3">
            <div className="text-[10px] font-bold text-[#6b6b7a] uppercase mb-2">{models[1]}</div>
            <pre className="text-xs text-amber-400/80 font-mono whitespace-pre-wrap">
              {diff.right}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
