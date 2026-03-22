import { PlanLimits, WorkspacePlan } from '../types/workspace';

export interface PlanConfig {
  id: WorkspacePlan;
  name: string;
  price: string;
  description: string;
  limits: PlanLimits;
}

export const PLANS: Record<WorkspacePlan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'For individuals and small projects.',
    limits: {
      maxProjects: 3,
      maxMembers: 1,
      maxTokensPerMonth: 50000,
      maxStorageMB: 100,
      allowedEconomyModes: ['turbo', 'balanced'],
      privateProjects: false,
      customDomains: false,
      sso: false,
      auditLogs: false,
      byok: false,
      selfHosted: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '$20/mo',
    description: 'For professional developers and growing apps.',
    limits: {
      maxProjects: 25,
      maxMembers: 5,
      maxTokensPerMonth: 2000000,
      maxStorageMB: 5000,
      allowedEconomyModes: ['turbo', 'balanced', 'max'],
      privateProjects: true,
      customDomains: true,
      sso: false,
      auditLogs: true,
      byok: true,
      selfHosted: false,
    },
  },
  team: {
    id: 'team',
    name: 'Team',
    price: '$150/mo',
    description: 'For teams collaborating on multiple projects.',
    limits: {
      maxProjects: -1, // Unlimited
      maxMembers: 50,
      maxTokensPerMonth: 10000000,
      maxStorageMB: 50000,
      allowedEconomyModes: ['turbo', 'balanced', 'max'],
      privateProjects: true,
      customDomains: true,
      sso: true,
      auditLogs: true,
      byok: true,
      selfHosted: false,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs.',
    limits: {
      maxProjects: -1, // Unlimited
      maxMembers: -1, // Unlimited
      maxTokensPerMonth: -1, // Unlimited
      maxStorageMB: -1, // Unlimited
      allowedEconomyModes: ['turbo', 'balanced', 'max'],
      privateProjects: true,
      customDomains: true,
      sso: true,
      auditLogs: true,
      byok: true,
      selfHosted: true,
    },
  },
};
