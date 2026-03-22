import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/shared/Input';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithGitHub, loginWithGoogle, loginWithEmail, signup } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    await loginWithGitHub();
    setIsLoading(false);
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
    navigate(from, { replace: true });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    if (isLogin) {
      await loginWithEmail(email);
      setIsSent(true);
    } else {
      await signup(name || email.split('@')[0], email);
      navigate('/onboarding', { replace: true });
    }
    setIsLoading(false);
  };

  const handleResend = () => {
    setIsSent(false);
    // In real app, trigger another email
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
          <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
        </div>
        <span className="text-2xl font-bold text-primary tracking-tight">Torsor</span>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm bg-surface border border-default rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AnimatePresence mode="wait">
          {isSent ? (
            <motion.div 
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                <Mail size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-primary">Check your email</h2>
                <p className="text-sm text-secondary">
                  We sent a login link to <span className="text-primary font-medium">{email}</span>
                </p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleResend}
                  className="text-sm font-bold text-accent hover:text-accent-hover transition-colors"
                >
                  Resend link
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <h2 className="text-xl font-medium text-primary">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-sm text-secondary">
                  {isLogin ? "Sign in to Torsor" : "Start building with Torsor"}
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleGitHubLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-elevated border border-default rounded-xl py-2.5 text-sm font-medium text-primary hover:bg-surface transition-all disabled:opacity-50"
                >
                  <Github size={18} />
                  Continue with GitHub
                </button>
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-elevated border border-default rounded-xl py-2.5 text-sm font-medium text-primary hover:bg-surface transition-all disabled:opacity-50"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>

              {/* Separator */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-default"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-tertiary uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-default"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-tertiary uppercase tracking-wider ml-1">Name</label>
                    <Input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required={!isLogin}
                      className="h-11 bg-page border-default rounded-xl px-4 text-sm"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-tertiary uppercase tracking-wider ml-1">Email</label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="h-11 bg-page border-default rounded-xl px-4 text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-accent hover:bg-accent-hover disabled:bg-elevated disabled:text-tertiary text-white rounded-xl font-bold text-sm shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Send magic link" : "Create account"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {!isSent && (
        <p className="mt-8 text-sm text-secondary animate-in fade-in duration-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-accent hover:text-accent-hover transition-colors"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      )}
    </div>
  );
}
