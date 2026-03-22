import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Trash2,
  Search,
  Filter,
  Check,
  X,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';

export function MemberManagement() {
  const { members, activeWorkspaceId } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');

  const workspaceMembers = members.filter(m => m.workspaceId === activeWorkspaceId);
  const filteredMembers = workspaceMembers.filter(m => 
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldAlert size={14} className="text-error" />;
      case 'member': return <ShieldCheck size={14} className="text-accent" />;
      default: return <Shield size={14} className="text-secondary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-primary">Workspace Members</h3>
          <p className="text-xs text-secondary">Manage who has access to this workspace and their permissions.</p>
        </div>
        <button 
          onClick={() => setIsInviting(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-lg shadow-accent/20 transition-all"
        >
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {isInviting && (
        <div className="bg-surface border border-accent/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={14} />
                <input 
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full bg-inset border border-default rounded-lg pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div className="w-32 space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Role</label>
              <select 
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full bg-inset border border-default rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsInviting(false)}
                className="p-2 text-secondary hover:text-primary hover:bg-elevated rounded-lg transition-all"
              >
                <X size={18} />
              </button>
              <button 
                className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition-all"
                onClick={() => {
                  // Handle invite
                  setIsInviting(false);
                  setInviteEmail('');
                }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface border border-default rounded-xl overflow-hidden">
        <div className="p-4 border-b border-default flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={14} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full bg-inset border border-default rounded-lg pl-9 pr-4 py-1.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-elevated hover:bg-inset border border-default text-secondary hover:text-primary text-xs font-medium rounded-lg transition-all">
            <Filter size={14} />
            Filter
          </button>
        </div>

        <div className="divide-y divide-default">
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-elevated/50 transition-colors group">
              <div className="flex items-center gap-3">
                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden bg-inset border border-default flex shrink-0">
                  <Avatar.Image 
                    src={member.user.avatarUrl || undefined} 
                    className="w-full h-full object-cover"
                  />
                  <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs font-bold text-secondary bg-elevated">
                    {member.user.name.substring(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-primary">{member.user.name}</p>
                    {member.role === 'admin' && (
                      <span className="px-1.5 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded uppercase tracking-tighter">Admin</span>
                    )}
                  </div>
                  <p className="text-[11px] text-secondary">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-inset border border-default rounded-lg">
                  {getRoleIcon(member.role)}
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{member.role}</span>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-2 text-tertiary hover:text-primary hover:bg-elevated rounded-lg transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content 
                      className="min-w-[160px] bg-elevated border border-default rounded-xl p-1 shadow-2xl animate-in fade-in zoom-in-95"
                      sideOffset={5}
                      align="end"
                    >
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs text-primary hover:bg-accent hover:text-white rounded-lg outline-none cursor-pointer transition-colors">
                        <Shield size={14} />
                        Change Role
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-[1px] bg-default my-1" />
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error hover:text-white rounded-lg outline-none cursor-pointer transition-colors">
                        <Trash2 size={14} />
                        Remove Member
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
