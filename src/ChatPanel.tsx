import React, { useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  History, 
  Maximize2, 
  Layout, 
  Plus,
  ArrowUp,
  Square
} from 'lucide-react';
import { useChatStore } from './stores/chatStore';
import { ChatMessage } from './components/chat/ChatMessage';
import { ChatInput } from './components/chat/ChatInput';

const SUGGESTIONS = [
  "Check my app for bugs",
  "Add payment processing",
  "Connect with an AI Assistant",
  "Add SMS message sending",
  "Add a database",
  "Add authenticated user login"
];

export default function ChatPanel() {
  const { messages, currentThread, isAgentWorking, sendMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      {/* THREAD HEADER */}
      {!isEmpty && currentThread && (
        <header className="h-9 bg-[#141416] border-b border-[#232328] px-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare size={12} className="text-violet-400 shrink-0" />
            <span className="text-xs font-medium text-[#e8e8ed] truncate">
              {currentThread.title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
              <History size={14} />
            </button>
            <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
              <Maximize2 size={14} />
            </button>
          </div>
        </header>
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#141416] border border-[#232328] flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-[#44444d]" />
            </div>
            <h2 className="text-base font-medium text-[#e8e8ed]">New chat with Agent</h2>
            <p className="text-sm text-[#6b6b7a] mt-1 max-w-[280px]">
              Agent can make changes, review its work, and debug itself automatically.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="bg-[#141416] border border-[#232328] rounded-full px-3 py-1.5 text-xs text-[#6b6b7a] hover:border-[#44444d] hover:text-[#e8e8ed] transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isAgentWorking && (
              <div className="flex items-center gap-2 py-2 px-1">
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Agent Thinking</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <ChatInput />
    </div>
  );
}
