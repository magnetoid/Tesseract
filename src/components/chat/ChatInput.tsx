import React, { useState, useRef, useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  Plus, 
  ArrowUp, 
  Square, 
  X, 
  Zap, 
  Scale, 
  ZapOff,
  Paperclip,
  Code2,
  Layout
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '../../lib/utils';
import { useChatStore } from '../../stores/chatStore';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { 
    sendMessage, 
    isAgentWorking, 
    selectedContext, 
    removeContext,
    planning,
    setPlanning
  } = useChatStore();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isAgentWorking) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-[#0a0a0c] pt-2 px-3 pb-3 space-y-2 z-10">
      {/* CONTEXT BAR */}
      {selectedContext.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedContext.map((item) => (
            <div 
              key={item.id}
              className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-400"
            >
              {item.type === 'file' && <Paperclip size={10} />}
              {item.type === 'code' && <Code2 size={10} />}
              {item.type === 'canvas' && <Layout size={10} />}
              <span>{item.name}</span>
              <button 
                onClick={() => removeContext(item.id)}
                className="hover:text-violet-300 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT CONTAINER */}
      <div className="bg-[#141416] border border-[#232328] rounded-2xl p-2 focus-within:border-[#44444d] transition-colors">
        <TextareaAutosize
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAgentWorking ? "Agent is working..." : "Make, test, iterate..."}
          disabled={isAgentWorking}
          className="w-full bg-transparent text-sm text-[#e8e8ed] placeholder-[#44444d] resize-none outline-none min-h-[36px] max-h-[120px] px-1 py-1"
        />

        <div className="flex items-center justify-between mt-1 px-1">
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-all">
              <Plus size={16} />
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[10px] font-bold text-[#6b6b7a] uppercase tracking-wider">Plan</span>
              <Switch.Root 
                checked={planning}
                onCheckedChange={setPlanning}
                className="w-7 h-4 bg-[#1c1c20] rounded-full relative data-[state=checked]:bg-violet-500 transition-colors outline-none cursor-pointer"
              >
                <Switch.Thumb className="block w-2.5 h-2.5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-3.5" />
              </Switch.Root>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-bold text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded transition-all">
                  <Zap size={12} className="text-violet-400" />
                  <span>Turbo</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-[#1c1c20] border border-[#232328] rounded-md p-1 shadow-xl z-[100] min-w-[120px]">
                  <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <Zap size={12} className="text-violet-400" /> Turbo
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <Scale size={12} className="text-amber-400" /> Balanced
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <ZapOff size={12} className="text-red-400" /> Max Power
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <button 
              onClick={handleSend}
              disabled={!input.trim() && !isAgentWorking}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                isAgentWorking 
                  ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
                  : input.trim() 
                    ? "bg-violet-500 text-white hover:bg-violet-400 shadow-lg shadow-violet-500/20" 
                    : "bg-[#1c1c20] text-[#44444d]"
              )}
            >
              {isAgentWorking ? <Square size={12} fill="currentColor" /> : <ArrowUp size={14} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
