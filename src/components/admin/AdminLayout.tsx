import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Activity, 
  Settings, 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useUserStore();
  const location = useLocation();

  // Route Guard
  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { id: 'workspaces', label: 'Workspaces', icon: Building2, href: '/admin/workspaces' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'revenue', label: 'Revenue', icon: CreditCard, href: '/admin/revenue' },
    { id: 'platform', label: 'Platform', icon: Activity, href: '/admin/platform' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex bg-page min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-[220px] bg-surface border-r border-default flex flex-col fixed h-screen z-50">
        <div className="p-6 flex items-center gap-3 border-b border-default">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <Shield size={18} />
          </div>
          <span className="font-bold text-primary tracking-tight">Torsor Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-secondary hover:bg-elevated hover:text-primary"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-accent" : "text-tertiary group-hover:text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-default space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-elevated hover:text-primary transition-all group"
          >
            <ArrowLeft size={18} className="text-tertiary group-hover:text-primary" />
            Back to App
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all group"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[220px] min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
