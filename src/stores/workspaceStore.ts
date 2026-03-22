import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Workspace, 
  WorkspaceMember, 
  WorkspaceInvite, 
  AuditLogEntry, 
  WorkspacePlan,
  PlanLimits,
  WorkspaceUsage
} from '../types/workspace';
import { PLANS } from '../lib/constants';
import { useEditorStore } from './editorStore';
import { useChatStore } from './chatStore';
import { useCanvasStore } from './canvasStore';

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
  auditLog: AuditLogEntry[];
  
  // Actions
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string, slug: string) => string;
  updateWorkspace: (id: string, data: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  inviteMember: (email: string, role: WorkspaceInvite['role']) => void;
  removeMember: (userId: string) => void;
  changeMemberRole: (userId: string, role: WorkspaceMember['role']) => void;
  acceptInvite: (inviteId: string) => void;
  revokeInvite: (inviteId: string) => void;
  logAuditEvent: (action: AuditLogEntry['action'], resource: string, details: string) => void;
  getActiveWorkspace: () => Workspace | undefined;
}

// Mock Data
const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Marko Workspace',
    slug: 'marko-workspace',
    logoUrl: null,
    ownerId: 'user-1',
    plan: 'pro',
    limits: PLANS.pro.limits,
    usage: {
      projectCount: 12,
      memberCount: 3,
      tokensUsedThisMonth: 450000,
      storageMB: 1200,
      lastResetDate: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ws-2',
    name: 'Torsor Team',
    slug: 'torsor-team',
    logoUrl: 'https://picsum.photos/seed/torsor/200',
    ownerId: 'user-1',
    plan: 'team',
    limits: PLANS.team.limits,
    usage: {
      projectCount: 45,
      memberCount: 15,
      tokensUsedThisMonth: 2500000,
      storageMB: 8500,
      lastResetDate: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const MOCK_MEMBERS: WorkspaceMember[] = [
  {
    id: 'mem-1',
    userId: 'user-1',
    workspaceId: 'ws-1',
    user: { name: 'Marko Tiosavljevic', email: 'marko.tiosavljevic@gmail.com', avatarUrl: 'https://picsum.photos/seed/marko/200' },
    role: 'owner',
    status: 'active',
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    userId: 'user-2',
    workspaceId: 'ws-1',
    user: { name: 'Jane Doe', email: 'jane@example.com', avatarUrl: 'https://picsum.photos/seed/jane/200' },
    role: 'admin',
    status: 'active',
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'mem-3',
    userId: 'user-3',
    workspaceId: 'ws-1',
    user: { name: 'Bob Smith', email: 'bob@example.com', avatarUrl: null },
    role: 'developer',
    status: 'active',
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  }
];

const MOCK_INVITES: WorkspaceInvite[] = [
  {
    id: 'inv-1',
    workspaceId: 'ws-1',
    email: 'new-dev@example.com',
    role: 'developer',
    status: 'pending',
    invitedBy: 'user-1',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-2',
    workspaceId: 'ws-1',
    email: 'viewer@example.com',
    role: 'viewer',
    status: 'pending',
    invitedBy: 'user-2',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const MOCK_AUDIT_LOG: AuditLogEntry[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `log-${i}`,
  workspaceId: 'ws-1',
  userId: i % 2 === 0 ? 'user-1' : 'user-2',
  userName: i % 2 === 0 ? 'Marko Tiosavljevic' : 'Jane Doe',
  action: i % 5 === 0 ? 'project_create' : i % 5 === 1 ? 'deploy' : i % 5 === 2 ? 'member_invite' : 'settings_update',
  resource: i % 5 === 0 ? 'Project Alpha' : i % 5 === 1 ? 'Production' : i % 5 === 2 ? 'new-dev@example.com' : 'Workspace Settings',
  details: `Action performed on ${new Date().toLocaleDateString()}`,
  ipAddress: '192.168.1.1',
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
}));

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: MOCK_WORKSPACES,
      activeWorkspaceId: MOCK_WORKSPACES[0].id,
      members: MOCK_MEMBERS,
      invites: MOCK_INVITES,
      auditLog: MOCK_AUDIT_LOG,

      switchWorkspace: (id) => {
        set({ activeWorkspaceId: id });
        
        // Clear project-specific state
        useEditorStore.getState().reset();
        useChatStore.getState().reset();
        useCanvasStore.getState().reset();
      },

      createWorkspace: (name, slug) => {
        const newId = `ws-${Math.random().toString(36).substring(7)}`;
        const newWorkspace: Workspace = {
          id: newId,
          name,
          slug,
          logoUrl: null,
          ownerId: 'user-1', // Assuming current user
          plan: 'free',
          limits: PLANS.free.limits,
          usage: {
            projectCount: 0,
            memberCount: 1,
            tokensUsedThisMonth: 0,
            storageMB: 0,
            lastResetDate: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ 
          workspaces: [...state.workspaces, newWorkspace],
          activeWorkspaceId: newWorkspace.id
        }));
        get().logAuditEvent('workspace_create', name, 'Created new workspace');
        return newId;
      },

      updateWorkspace: (id, data) => {
        set((state) => ({
          workspaces: state.workspaces.map((ws) => 
            ws.id === id ? { ...ws, ...data, updatedAt: new Date().toISOString() } : ws
          ),
        }));
        get().logAuditEvent('settings_update', id, 'Updated workspace settings');
      },

      deleteWorkspace: (id) => {
        set((state) => ({
          workspaces: state.workspaces.filter((ws) => ws.id !== id),
          activeWorkspaceId: state.activeWorkspaceId === id 
            ? state.workspaces.find((ws) => ws.id !== id)?.id || '' 
            : state.activeWorkspaceId
        }));
      },

      inviteMember: (email, role) => {
        const newInvite: WorkspaceInvite = {
          id: `inv-${Math.random().toString(36).substring(7)}`,
          workspaceId: get().activeWorkspaceId,
          email,
          role,
          status: 'pending',
          invitedBy: 'user-1',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        set((state) => ({ invites: [...state.invites, newInvite] }));
        get().logAuditEvent('member_invite', email, `Invited as ${role}`);
      },

      removeMember: (userId) => {
        set((state) => ({
          members: state.members.filter((m) => m.userId !== userId || m.workspaceId !== state.activeWorkspaceId)
        }));
        get().logAuditEvent('member_remove', userId, 'Removed member from workspace');
      },

      changeMemberRole: (userId, role) => {
        set((state) => ({
          members: state.members.map((m) => 
            (m.userId === userId && m.workspaceId === state.activeWorkspaceId) ? { ...m, role } : m
          )
        }));
        get().logAuditEvent('role_change', userId, `Changed role to ${role}`);
      },

      acceptInvite: (inviteId) => {
        const invite = get().invites.find((i) => i.id === inviteId);
        if (!invite) return;

        const newMember: WorkspaceMember = {
          id: `mem-${Math.random().toString(36).substring(7)}`,
          userId: `user-${Math.random().toString(36).substring(7)}`, // Mock user creation
          workspaceId: invite.workspaceId,
          user: { name: invite.email.split('@')[0], email: invite.email, avatarUrl: null },
          role: invite.role as WorkspaceMember['role'],
          status: 'active',
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };

        set((state) => ({
          invites: state.invites.filter((i) => i.id !== inviteId),
          members: [...state.members, newMember]
        }));
      },

      revokeInvite: (inviteId) => {
        set((state) => ({
          invites: state.invites.filter((i) => i.id !== inviteId)
        }));
      },

      logAuditEvent: (action, resource, details) => {
        const newEntry: AuditLogEntry = {
          id: `log-${Math.random().toString(36).substring(7)}`,
          workspaceId: get().activeWorkspaceId,
          userId: 'user-1',
          userName: 'Marko Tiosavljevic',
          action,
          resource,
          details,
          ipAddress: '192.168.1.1',
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ auditLog: [newEntry, ...state.auditLog].slice(0, 100) }));
      },

      getActiveWorkspace: () => {
        const { workspaces, activeWorkspaceId } = get();
        return workspaces.find(ws => ws.id === activeWorkspaceId);
      },
    }),
    {
      name: 'torsor-workspace-storage',
      partialize: (state) => ({ activeWorkspaceId: state.activeWorkspaceId }),
    }
  )
);

// Computed Selectors
export const useActiveWorkspace = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  return workspaces.find((ws) => ws.id === activeWorkspaceId) || workspaces[0];
};

export const useWorkspacePlan = () => {
  const workspace = useActiveWorkspace();
  return PLANS[workspace.plan].limits;
};

export const useWorkspaceUsage = () => {
  const workspace = useActiveWorkspace();
  return workspace.usage;
};

export const useIsAtLimit = (resource: 'projects' | 'tokens' | 'storage' | 'members') => {
  const limits = useWorkspacePlan();
  const usage = useWorkspaceUsage();

  switch (resource) {
    case 'projects':
      return limits.maxProjects !== -1 && usage.projectCount >= limits.maxProjects;
    case 'tokens':
      return limits.maxTokensPerMonth !== -1 && usage.tokensUsedThisMonth >= limits.maxTokensPerMonth;
    case 'storage':
      return limits.maxStorageMB !== -1 && usage.storageMB >= limits.maxStorageMB;
    case 'members':
      return limits.maxMembers !== -1 && usage.memberCount >= limits.maxMembers;
    default:
      return false;
  }
};

export const useCanUseFeature = (feature: keyof PlanLimits) => {
  const limits = useWorkspacePlan();
  return !!limits[feature];
};
