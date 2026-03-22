import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Progress from '@radix-ui/react-progress';
import { 
  X, 
  ChevronRight, 
  Rocket, 
  Globe, 
  Server, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy,
  Plus,
  Trash2,
  Lock,
  Zap,
  Cloud,
  Cpu,
  Loader2
} from 'lucide-react';
import { useAppStore } from './useAppStore';
import { useAuthStore } from './stores/authStore';
import { useActiveWorkspace } from './stores/workspaceStore';
import { cn } from './lib/utils';

interface DeployModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState<'Vercel' | 'Netlify' | 'Coolify' | 'Custom' | null>(null);
  const [env, setEnv] = useState('Production');
  const [branch, setBranch] = useState('main');
  const [envVars, setEnvVars] = useState([{ name: 'NODE_ENV', value: 'production' }, { name: 'VITE_API_URL', value: 'https://api.tesseract.app' }]);
  const [domains, setDomains] = useState<{ name: string; status: 'active' | 'pending' }[]>([
    { name: 'www.tesseract.app', status: 'active' }
  ]);
  const [newDomain, setNewDomain] = useState('');
  const [showDnsInfo, setShowDnsInfo] = useState(false);
  
  const deployStatus = useAppStore(state => state.deployStatus);
  const deployProgress = useAppStore(state => state.deployProgress);
  const deployLogs = useAppStore(state => state.deployLogs);
  const startDeploy = useAppStore(state => state.startDeploy);
  const { user } = useAuthStore();
  const activeWorkspace = useActiveWorkspace();

  const handleDeploy = async () => {
    if (!target) return;
    setStep(3);
    await startDeploy(target, env, branch);
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { name: '', value: '' }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const addDomain = () => {
    if (!newDomain.trim()) return;
    setDomains([...domains, { name: newDomain, status: 'pending' }]);
    setNewDomain('');
    setShowDnsInfo(true);
  };

  const removeDomain = (name: string) => {
    setDomains(domains.filter(d => d.name !== name));
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setTarget(null);
      }, 300);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-[#1c1c20] border border-[#2a2a30] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#2a2a30] flex items-center justify-between bg-[#141416]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Rocket size={18} className="text-emerald-400" />
              </div>
              <div>
                <Dialog.Title className="text-[#e8e8ed] font-bold">Deploy Application</Dialog.Title>
                <Dialog.Description className="text-[#6b6b7a] text-xs">
                  {step === 1 ? 'Choose your deployment target' : step === 2 ? 'Configure environment and variables' : 'Building and deploying...'}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-2 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors rounded-lg hover:bg-[#2a2a30]">
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className="p-6">
            {/* Step 1: Choose Target */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Vercel', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10', desc: 'Zero-config deployment' },
                    { id: 'Netlify', icon: Cloud, color: 'text-teal-400', bg: 'bg-teal-500/10', desc: 'Continuous deployment' },
                    { id: 'Coolify', icon: Server, color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Self-hosted on your server' },
                    { id: 'Custom', icon: Cpu, color: 'text-gray-400', bg: 'bg-gray-500/10', desc: 'SSH to any server' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTarget(item.id as any)}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-xl border transition-all text-left group",
                        target === item.id 
                          ? "bg-violet-500/5 border-violet-500/50 ring-1 ring-violet-500/50" 
                          : "bg-[#141416] border-[#2a2a30] hover:border-[#3a3a40]"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-white/5", item.bg)}>
                        <item.icon size={20} className={item.color} />
                      </div>
                      <span className="text-[#e8e8ed] font-bold text-sm mb-1">{item.id}</span>
                      <span className="text-[#6b6b7a] text-xs leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={!target}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Configure */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b7a] uppercase tracking-wider">Environment</label>
                    <select 
                      value={env}
                      onChange={(e) => setEnv(e.target.value)}
                      className="w-full bg-[#141416] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] outline-none focus:border-violet-500/50"
                    >
                      <option>Preview</option>
                      <option>Staging</option>
                      <option>Production</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b7a] uppercase tracking-wider">Branch</label>
                    <select 
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-[#141416] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] outline-none focus:border-violet-500/50"
                    >
                      <option>main</option>
                      <option>dev</option>
                      <option>feature/auth</option>
                      <option>feature/dashboard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#6b6b7a] uppercase tracking-wider">Environment Variables</label>
                    <button 
                      onClick={addEnvVar}
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                    >
                      <Plus size={12} />
                      Add Variable
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {envVars.map((v, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="KEY"
                          value={v.name}
                          onChange={(e) => {
                            const newVars = [...envVars];
                            newVars[i].name = e.target.value;
                            setEnvVars(newVars);
                          }}
                          className="flex-1 bg-[#141416] border border-[#2a2a30] rounded-lg px-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50"
                        />
                        <div className="relative flex-1">
                          <input 
                            type="password" 
                            placeholder="VALUE"
                            value={v.value}
                            onChange={(e) => {
                              const newVars = [...envVars];
                              newVars[i].value = e.target.value;
                              setEnvVars(newVars);
                            }}
                            className="w-full bg-[#141416] border border-[#2a2a30] rounded-lg px-3 py-1.5 text-xs text-[#e8e8ed] outline-none focus:border-violet-500/50 pr-8"
                          />
                          <Lock size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b6b7a]" />
                        </div>
                        <button 
                          onClick={() => removeEnvVar(i)}
                          className="p-2 text-[#6b6b7a] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#2a2a30]">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-[#6b6b7a] hover:text-[#e8e8ed] font-medium transition-colors"
                  >
                    Back
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(4)}
                      className="px-4 py-2 text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors"
                    >
                      Setup Domains
                    </button>
                    <button
                      onClick={handleDeploy}
                      className="px-8 py-2 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-violet-500/20"
                    >
                      Deploy to {target}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Custom Domains */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. app.yourdomain.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="flex-1 bg-[#141416] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-[#e8e8ed] outline-none focus:border-violet-500/50"
                    />
                    <button 
                      onClick={() => {
                        if (activeWorkspace?.plan === 'free') {
                          alert('Upgrade to Pro to add custom domains');
                          return;
                        }
                        addDomain();
                      }}
                      className="px-4 py-2 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg text-sm transition-all"
                    >
                      Add Domain
                    </button>
                  </div>

                  {showDnsInfo && (
                    <div className="bg-[#0d0d0f] rounded-xl border border-amber-500/20 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <AlertCircle size={14} />
                        DNS Configuration Required
                      </div>
                      <p className="text-[#6b6b7a] text-xs">Add the following CNAME record to your DNS provider to verify ownership.</p>
                      <div className="bg-[#141416] rounded-lg border border-[#2a2a30] overflow-hidden">
                        <table className="w-full text-[10px] text-left">
                          <thead className="bg-[#1c1c20] text-[#6b6b7a] border-b border-[#2a2a30]">
                            <tr>
                              <th className="px-3 py-2 font-medium">Type</th>
                              <th className="px-3 py-2 font-medium">Name</th>
                              <th className="px-3 py-2 font-medium">Value</th>
                            </tr>
                          </thead>
                          <tbody className="text-[#e8e8ed] font-mono">
                            <tr>
                              <td className="px-3 py-2">CNAME</td>
                              <td className="px-3 py-2">www</td>
                              <td className="px-3 py-2 flex items-center justify-between">
                                cname.tesseract.app
                                <button className="text-[#6b6b7a] hover:text-[#e8e8ed]">
                                  <Copy size={12} />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#6b6b7a]">
                        <Loader2 size={10} className="animate-spin" />
                        Waiting for DNS propagation...
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b6b7a] uppercase tracking-wider">Configured Domains</label>
                    <div className="space-y-2">
                      {domains.map((d) => (
                        <div key={d.name} className="flex items-center justify-between p-3 bg-[#141416] border border-[#2a2a30] rounded-xl">
                          <div className="flex items-center gap-3">
                            <Globe size={16} className="text-[#6b6b7a]" />
                            <span className="text-sm text-[#e8e8ed] font-medium">{d.name}</span>
                            <span className={cn(
                              "px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              d.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                            )}>
                              {d.status === 'active' ? 'SSL Active' : 'Pending'}
                            </span>
                          </div>
                          <button 
                            onClick={() => removeDomain(d.name)}
                            className="p-2 text-[#6b6b7a] hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#2a2a30]">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-[#6b6b7a] hover:text-[#e8e8ed] font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-2 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg transition-all"
                  >
                    Save & Return
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Building */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#e8e8ed]">
                      {deployStatus === 'building' ? 'Building application...' : deployStatus === 'success' ? 'Deployment successful!' : 'Deployment failed'}
                    </span>
                    <span className="text-[#6b6b7a]">{Math.round(deployProgress)}%</span>
                  </div>
                  <Progress.Root className="h-2 bg-[#141416] rounded-full overflow-hidden border border-[#2a2a30]">
                    <Progress.Indicator 
                      className="h-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${deployProgress}%` }}
                    />
                  </Progress.Root>
                </div>

                <div className={cn(
                  "bg-[#0d0d0f] rounded-xl border p-4 font-mono text-[11px] leading-relaxed transition-colors",
                  deployStatus === 'success' ? "border-emerald-500/30" : deployStatus === 'error' ? "border-red-500/30" : "border-[#2a2a30]"
                )}>
                  <ScrollArea.Root className="h-48">
                    <ScrollArea.Viewport className="w-full h-full">
                      <div className="space-y-1">
                        {deployLogs.map((log, i) => (
                          <div key={i} className={cn(
                            log.startsWith('→') ? "text-[#e8e8ed]" : 
                            log.startsWith('  ✓') || log.startsWith('✅') ? "text-emerald-400" :
                            log.includes('error') ? "text-red-400" :
                            "text-[#6b6b7a]"
                          )}>
                            {log}
                          </div>
                        ))}
                        {deployStatus === 'building' && (
                          <div className="flex items-center gap-2 text-[#6b6b7a]">
                            <span className="w-1 h-3 bg-violet-500 animate-pulse" />
                            <span>_</span>
                          </div>
                        )}
                      </div>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent w-1.5 transition-colors">
                      <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-full" />
                    </ScrollArea.Scrollbar>
                  </ScrollArea.Root>
                </div>

                {deployStatus === 'success' && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Globe size={20} className="text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-[#e8e8ed] font-bold text-sm">Live URL</div>
                          <a 
                            href={`https://tesseract-demo.${target?.toLowerCase()}.app`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 text-xs hover:underline flex items-center gap-1"
                          >
                            tesseract-demo.{target?.toLowerCase()}.app
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors rounded-lg hover:bg-[#2a2a30]">
                          <Copy size={16} />
                        </button>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg text-xs transition-all">
                          Open App
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => onOpenChange(false)}
                      className="w-full py-2 text-[#6b6b7a] hover:text-[#e8e8ed] text-sm font-medium transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}

                {deployStatus === 'error' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDeploy}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-all"
                    >
                      Retry
                    </button>
                    <button className="flex-1 py-2 bg-[#2a2a30] hover:bg-[#3a3a40] text-[#e8e8ed] font-bold rounded-lg transition-all">
                      View Full Logs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
