import React from 'react';
import { useNavigate } from 'react-router';
import { Rocket, Sparkles, CheckCircle2 } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#e8e8ed] flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Rocket size={40} className="text-violet-400" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to Tesseract</h1>
        <p className="text-[#6b6b7a] text-lg mb-12">Let's get your workspace ready for agentic development.</p>
        
        <div className="grid gap-4 text-left mb-12">
          <div className="flex items-center gap-4 p-4 bg-[#141416] border border-[#2a2a30] rounded-xl">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <span className="font-medium">Account created successfully</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-[#141416] border border-[#2a2a30] rounded-xl opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#1c1c20] flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-[#6b6b7a]" />
            </div>
            <span className="font-medium">Provisioning your first workspace...</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full h-12 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};
