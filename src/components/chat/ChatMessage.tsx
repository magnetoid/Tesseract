import React from 'react';
import { 
  User, 
  Bot, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Rocket, 
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ChatMessageData } from '../../stores/chatStore';

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const isAgent = message.type === 'agent';
  const isWork = message.type === 'work';
  const isPlan = message.type === 'plan';
  const isTerminal = message.type === 'terminal';
  const isError = message.type === 'error';
  const isDeploy = message.type === 'deploy';

  if (isWork) {
    return (
      <div className="flex items-center gap-2 py-1.5 px-2 bg-[#141416]/50 rounded-lg border border-[#232328] mb-2">
        <Loader2 size={12} className="text-violet-400 animate-spin" />
        <span className="text-[11px] text-[#6b6b7a] font-medium">{message.content}</span>
      </div>
    );
  }

  if (isPlan) {
    return (
      <div className="bg-[#141416] border border-[#232328] rounded-xl p-3 mb-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={14} className="text-violet-400" />
          <span className="text-xs font-bold text-[#e8e8ed]">Proposed Plan</span>
        </div>
        <div className="space-y-2">
          {message.metadata?.steps?.map((step: any, idx: number) => (
            <div key={idx} className="flex gap-2 text-xs text-[#6b6b7a]">
              <span className="text-violet-400 font-mono">{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 bg-violet-500 hover:bg-violet-400 text-white py-1 rounded-md text-[10px] font-bold transition-colors">
            Approve & Execute
          </button>
          <button className="px-3 border border-[#232328] text-[#6b6b7a] hover:text-[#e8e8ed] py-1 rounded-md text-[10px] font-bold transition-colors">
            Modify
          </button>
        </div>
      </div>
    );
  }

  if (isTerminal) {
    return (
      <div className="bg-[#0a0a0c] border border-[#232328] rounded-lg mb-4 overflow-hidden">
        <div className="bg-[#141416] px-2 py-1 border-b border-[#232328] flex items-center gap-2">
          <Terminal size={10} className="text-[#6b6b7a]" />
          <span className="text-[10px] font-mono text-[#6b6b7a]">terminal</span>
        </div>
        <pre className="p-2 text-[11px] font-mono text-emerald-400 overflow-x-auto">
          <code>{message.content}</code>
        </pre>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex gap-3">
        <AlertCircle size={16} className="text-red-400 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-red-400">Error encountered</p>
          <p className="text-xs text-red-400/80 leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  if (isDeploy) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 flex gap-3">
        <Rocket size={16} className="text-emerald-400 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-emerald-400">Deployment Successful</p>
          <p className="text-xs text-emerald-400/80 leading-relaxed">{message.content}</p>
          <button className="mt-2 text-[10px] font-bold text-emerald-400 underline underline-offset-2">
            View Live App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-3 mb-6",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
        isUser ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-[#1c1c20] border-[#232328] text-[#6b6b7a]"
      )}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div className={cn(
        "max-w-[85%] space-y-1",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-3 py-2 rounded-2xl text-sm leading-relaxed",
          isUser 
            ? "bg-violet-500 text-white rounded-tr-none" 
            : "bg-[#141416] text-[#e8e8ed] border border-[#232328] rounded-tl-none"
        )}>
          {message.content}
        </div>
        <span className="text-[10px] text-[#44444d] px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
