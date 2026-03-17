import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutGrid, 
  Layers, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronDown,
  Check,
  Download,
  Sparkles,
  CreditCard as CardIcon,
  Calendar,
  TrendingUp,
  Clock,
  Box,
  ArrowUpRight
} from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Progress from '@radix-ui/react-progress';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuthStore } from '../stores/authStore';
import { usageMock } from '../lib/mockData';
import { cn } from '../lib/utils';

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-200",
      active 
        ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500" 
        : "text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20]"
    )}
  >
    <Icon size={18} />
    {label}
  </button>
);

const PlanCard = ({ 
  title, 
  price, 
  features, 
  isCurrent, 
  isPopular, 
  buttonText, 
  gradient,
  borderClass = "border-[#2a2a30]"
}: { 
  title: string, 
  price: string, 
  features: string[], 
  isCurrent?: boolean, 
  isPopular?: boolean, 
  buttonText: string,
  gradient?: boolean,
  borderClass?: string
}) => (
  <div className={cn(
    "flex-1 p-6 rounded-xl border flex flex-col relative overflow-hidden",
    gradient ? "bg-gradient-to-br from-violet-500/10 to-transparent" : "bg-[#141416]",
    borderClass
  )}>
    {isPopular && (
      <div className="absolute top-4 right-4 bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        Most Popular
      </div>
    )}
    <h3 className="text-lg font-bold mb-1">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-2xl font-bold">{price}</span>
      {price !== 'Custom' && <span className="text-xs text-[#6b6b7a]">/mo</span>}
    </div>
    
    <ul className="space-y-3 mb-8 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-[#e8e8ed]">
          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>

    <button 
      disabled={isCurrent}
      className={cn(
        "w-full py-2 rounded-md text-sm font-bold transition-all",
        isCurrent 
          ? "bg-[#1c1c20] text-[#6b6b7a] cursor-not-allowed border border-[#2a2a30]" 
          : isPopular
            ? "bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/20"
            : "bg-[#1c1c20] hover:bg-[#2a2a30] text-[#e8e8ed] border border-[#2a2a30]"
      )}
    >
      {isCurrent ? 'Current Plan' : buttonText}
    </button>
  </div>
);

const StatCard = ({ label, value, max, icon: Icon }: { label: string, value: string | number, max: string | number, icon: React.ElementType }) => {
  const percentage = typeof max === 'number' ? (Number(value) / max) * 100 : 0;
  
  return (
    <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#6b6b7a]">{label}</span>
        <Icon size={14} className="text-[#6b6b7a]" />
      </div>
      <div className="text-lg font-bold mb-2">
        {value} <span className="text-xs font-normal text-[#6b6b7a]">/ {max}</span>
      </div>
      {typeof max === 'number' && (
        <Progress.Root className="h-1.5 w-full bg-[#0d0d0f] rounded-full overflow-hidden">
          <Progress.Indicator 
            className="h-full bg-violet-500 transition-transform duration-500"
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </Progress.Root>
      )}
    </div>
  );
};

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ed] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-[#141416] border-r border-[#2a2a30] flex flex-col shrink-0">
        <div className="p-4">
          <Select.Root defaultValue="personal">
            <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-[#1c1c20] border border-[#2a2a30] rounded-md text-sm font-medium outline-none hover:border-violet-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-violet-500 rounded flex items-center justify-center text-[10px] text-white">T</div>
                <Select.Value />
              </div>
              <Select.Icon>
                <ChevronDown size={14} className="text-[#6b6b7a]" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-[#1c1c20] border border-[#2a2a30] rounded-md shadow-xl z-50 overflow-hidden">
                <Select.Viewport className="p-1">
                  <Select.Item value="personal" className="flex items-center px-3 py-2 text-sm text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <Select.ItemText>Personal Workspace</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="team" className="flex items-center px-3 py-2 text-sm text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none">
                    <Select.ItemText>Acme Team</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <nav className="flex-1 mt-4">
          <NavItem icon={LayoutGrid} label="Projects" onClick={() => navigate('/dashboard')} />
          <NavItem icon={Sparkles} label="Model Arena" onClick={() => navigate('/arena')} />
          <NavItem icon={Users} label="Team" onClick={() => navigate('/team')} />
          <NavItem icon={CreditCard} label="Billing" active />
          <NavItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
        </nav>

        <div className="p-4 border-t border-[#2a2a30]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center overflow-hidden">
              <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-[#6b6b7a] truncate">Pro Plan</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6b6b7a] hover:text-red-400 hover:bg-red-400/5 rounded transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#2a2a30] bg-[#0d0d0f] flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold tracking-tight">Billing & Usage</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Plan Cards */}
            <section>
              <h3 className="text-sm font-bold text-[#6b6b7a] uppercase tracking-wider mb-6">Subscription Plans</h3>
              <div className="flex flex-row gap-6">
                <PlanCard 
                  title="Free"
                  price="$0"
                  features={[
                    "1 workspace",
                    "3 projects",
                    "50K tokens/mo",
                    "Gemini Flash + local only",
                    "10 sandbox hrs",
                    "Public projects only"
                  ]}
                  buttonText="Downgrade"
                />
                <PlanCard 
                  title="Pro"
                  price="$25"
                  isPopular
                  isCurrent
                  borderClass="border-violet-500"
                  features={[
                    "Unlimited workspaces",
                    "25 projects",
                    "2M tokens/mo",
                    "All 6 agent models",
                    "100 sandbox hrs",
                    "Private projects",
                    "Custom domains"
                  ]}
                  buttonText="Current Plan"
                />
                <PlanCard 
                  title="Team"
                  price="$49"
                  features={[
                    "Everything in Pro",
                    "Unlimited projects",
                    "10M tokens/mo",
                    "500 sandbox hrs",
                    "BYOK (Bring Your Own Key)",
                    "SSO / SAML",
                    "Audit logs & SLA"
                  ]}
                  buttonText="Upgrade to Team"
                />
                <PlanCard 
                  title="Enterprise"
                  price="Custom"
                  gradient
                  features={[
                    "Self-hosted option",
                    "Dedicated infrastructure",
                    "Model fine-tuning",
                    "Air-gapped deployment",
                    "24/7 Priority support"
                  ]}
                  buttonText="Contact Sales"
                />
              </div>
            </section>

            {/* Usage Dashboard */}
            <section>
              <h3 className="text-sm font-bold text-[#6b6b7a] uppercase tracking-wider mb-6">Usage Overview</h3>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard label="Tokens Used" value="1.2M" max="2M" icon={TrendingUp} />
                <StatCard label="Sandbox Hours" value="42" max="100" icon={Clock} />
                <StatCard label="Projects" value="8" max="25" icon={Box} />
                <StatCard label="Team Members" value="3" max="unlimited" icon={Users} />
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Chart */}
                <div className="col-span-2 bg-[#141416] border border-[#2a2a30] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold">Token Usage (Last 30 Days)</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6b6b7a]">
                        <div className="w-2 h-2 rounded-full bg-violet-500" /> Claude
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6b6b7a]">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> GPT
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6b6b7a]">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> DeepSeek
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6b6b7a]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> Gemini
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usageMock.chartData}>
                        <defs>
                          <linearGradient id="colorClaude" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGPT" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b6b7a" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          interval={6}
                        />
                        <YAxis 
                          stroke="#6b6b7a" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1c1c20', border: '1px solid #2a2a30', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ padding: '2px 0' }}
                        />
                        <Area type="monotone" dataKey="Claude" stackId="1" stroke="#8b5cf6" fill="url(#colorClaude)" />
                        <Area type="monotone" dataKey="GPT" stackId="1" stroke="#3b82f6" fill="url(#colorGPT)" />
                        <Area type="monotone" dataKey="DeepSeek" stackId="1" stroke="#f59e0b" fillOpacity={0.1} fill="#f59e0b" />
                        <Area type="monotone" dataKey="Gemini" stackId="1" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-6">
                  <h4 className="text-sm font-bold mb-6">Cost Breakdown</h4>
                  <div className="space-y-4">
                    {usageMock.tokens.breakdown.map((item) => (
                      <div key={item.model} className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#e8e8ed]">{item.model}</span>
                          <span className="text-[#6b6b7a]">${item.cost.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-[#0d0d0f] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500/50" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#6b6b7a] w-8 text-right">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-[#2a2a30] flex items-center justify-between">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-sm font-bold text-violet-400">$28.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Details */}
            <section className="grid grid-cols-3 gap-8 pb-12">
              <div className="col-span-1 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#6b6b7a] uppercase tracking-wider mb-4">Payment Method</h3>
                  <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-[#1c1c20] border border-[#2a2a30] rounded flex items-center justify-center">
                        <CardIcon size={14} className="text-[#6b6b7a]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visa **** 4242</p>
                        <p className="text-[10px] text-[#6b6b7a]">Expires 12/27</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-violet-400 hover:text-violet-300">Update</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#6b6b7a] uppercase tracking-wider mb-4">Next Billing Date</h3>
                  <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4 flex items-center gap-3">
                    <Calendar size={18} className="text-violet-400" />
                    <div>
                      <p className="text-sm font-medium">March 28, 2026</p>
                      <p className="text-[10px] text-[#6b6b7a]">Estimated: $28.00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <h3 className="text-sm font-bold text-[#6b6b7a] uppercase tracking-wider mb-4">Invoice History</h3>
                <div className="bg-[#141416] border border-[#2a2a30] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#2a2a30] bg-[#1c1c20]/50">
                        <th className="px-6 py-3 font-medium text-[#6b6b7a] text-xs uppercase tracking-wider">Invoice ID</th>
                        <th className="px-6 py-3 font-medium text-[#6b6b7a] text-xs uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 font-medium text-[#6b6b7a] text-xs uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 font-medium text-[#6b6b7a] text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 font-medium text-[#6b6b7a] text-xs uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2a30]">
                      {usageMock.invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-[#1c1c20] transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{invoice.id}</td>
                          <td className="px-6 py-4 text-[#6b6b7a]">{invoice.date}</td>
                          <td className="px-6 py-4 font-medium">{invoice.amount}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              invoice.status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            )}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] transition-colors">
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};
