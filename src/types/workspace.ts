export type WorkspacePlan = 'free' | 'pro' | 'team' | 'enterprise';

export interface PlanLimits {
  maxProjects: number;        // free=3, pro=25, team=unlimited(-1), enterprise=unlimited
  maxMembers: number;         // free=1, pro=5, team=50, enterprise=unlimited
  maxTokensPerMonth: number;  // free=50000, pro=2000000, team=10000000
  maxStorageMB: number;       // free=100, pro=5000, team=50000
  allowedEconomyModes: ('turbo' | 'balanced' | 'max')[];
  privateProjects: boolean;
  customDomains: boolean;
  sso: boolean;
  auditLogs: boolean;
  byok: boolean;             // bring your own API keys
  selfHosted: boolean;
}

export interface WorkspaceUsage {
  projectCount: number;
  memberCount: number;
  tokensUsedThisMonth: number;
  storageMB: number;
  lastResetDate: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;          // URL-safe: marko-workspace
  logoUrl: string | null;
  ownerId: string;
  plan: WorkspacePlan;
  limits: PlanLimits;
  usage: WorkspaceUsage;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'user' | 'super_admin';
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  user: Pick<User, 'name' | 'email' | 'avatarUrl'>;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
  lastActiveAt: string;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface AuditLogEntry {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  action: 
    | 'login' 
    | 'project_create' 
    | 'project_delete' 
    | 'member_invite' 
    | 'member_remove' 
    | 'role_change' 
    | 'settings_update' 
    | 'deploy' 
    | 'model_switch' 
    | 'secret_create' 
    | 'secret_delete' 
    | 'plan_change' 
    | 'workspace_create';
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
