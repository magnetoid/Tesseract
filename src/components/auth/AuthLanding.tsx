import React, { useState } from 'react';
import * as Separator from '@radix-ui/react-separator';
import { Github, Mail, Chrome, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export function AuthLanding() {
  const { loginWithGitHub, loginWithGoogle, loginWithEmail, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      loginWithEmail(email);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo */}
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-violet-500">
            <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="8" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#e8e8ed] tracking-tight">What do you want to build?</h1>
          <p className="text-[#6b6b7a] text-sm">Join Tesseract to start building with AI agents.</p>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={() => loginWithGitHub()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#141416] border border-[#232328] hover:border-[#2a2a30] hover:bg-[#1c1c20] text-[#e8e8ed] rounded-xl px-6 py-3.5 font-medium transition-all group"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Github size={20} className="group-hover:text-violet-400 transition-colors" />}
            Continue with GitHub
          </button>

          <button 
            onClick={() => loginWithGoogle()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#141416] border border-[#232328] hover:border-[#2a2a30] hover:bg-[#1c1c20] text-[#e8e8ed] rounded-xl px-6 py-3.5 font-medium transition-all group"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Chrome size={20} className="group-hover:text-violet-400 transition-colors" />}
            Continue with Google
          </button>
        </div>

        <div className="w-full flex items-center gap-4 py-2">
          <Separator.Root className="flex-1 h-[1px] bg-[#232328]" />
          <span className="text-[10px] font-bold text-[#44444d] uppercase tracking-widest">or</span>
          <Separator.Root className="flex-1 h-[1px] bg-[#232328]" />
        </div>

        <form onSubmit={handleEmailLogin} className="w-full space-y-3">
          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#44444d] group-focus-within:text-violet-500 transition-colors" />
            <input 
              type="email" 
              placeholder="Enter your email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#141416] border border-[#232328] focus:border-violet-500/50 rounded-xl pl-12 pr-4 py-3.5 text-[#e8e8ed] outline-none transition-all placeholder:text-[#44444d]"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white font-bold rounded-xl px-6 py-3.5 transition-all shadow-lg shadow-violet-600/20"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Continue'}
          </button>
          <p className="text-center text-xs text-[#44444d]">
            No account? We'll create one.
          </p>
        </form>
      </div>
    </div>
  );
}
