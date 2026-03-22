import { useWorkspaceStore } from '../stores/workspaceStore';
import { WorkspacePlan } from '../types/workspace';

type Feature = 'create_project' | 'max_power_mode' | 'private_project' | 'custom_domain' | 'audit_logs' | 'sso' | 'byok';

interface PlanGateResult {
  allowed: boolean;
  reason?: string;
  requiredPlan?: WorkspacePlan;
}

export function usePlanGate() {
  const { getActiveWorkspace } = useWorkspaceStore();
  const activeWorkspace = getActiveWorkspace();

  const checkFeature = (feature: Feature): PlanGateResult => {
    if (!activeWorkspace) return { allowed: false, reason: 'No active workspace' };

    const { plan, limits, usage } = activeWorkspace;

    switch (feature) {
      case 'create_project':
        if (limits.maxProjects !== -1 && usage.projectCount >= limits.maxProjects) {
          return { 
            allowed: false, 
            reason: `You've reached the project limit for the ${plan} plan.`,
            requiredPlan: plan === 'free' ? 'pro' : 'team'
          };
        }
        return { allowed: true };

      case 'max_power_mode':
        if (!limits.allowedEconomyModes.includes('max')) {
          return { 
            allowed: false, 
            reason: 'Max Power mode is only available on Pro and higher plans.',
            requiredPlan: 'pro'
          };
        }
        return { allowed: true };

      case 'private_project':
        if (!limits.privateProjects) {
          return { 
            allowed: false, 
            reason: 'Private projects are only available on Pro and higher plans.',
            requiredPlan: 'pro'
          };
        }
        return { allowed: true };

      case 'custom_domain':
        if (!limits.customDomains) {
          return { 
            allowed: false, 
            reason: 'Custom domains are only available on Pro and higher plans.',
            requiredPlan: 'pro'
          };
        }
        return { allowed: true };

      case 'audit_logs':
        if (!limits.auditLogs) {
          return { 
            allowed: false, 
            reason: 'Audit logs are only available on Team and Enterprise plans.',
            requiredPlan: 'team'
          };
        }
        return { allowed: true };

      case 'sso':
        if (!limits.sso) {
          return { 
            allowed: false, 
            reason: 'SSO is only available on Team and Enterprise plans.',
            requiredPlan: 'team'
          };
        }
        return { allowed: true };

      case 'byok':
        if (!limits.byok) {
          return { 
            allowed: false, 
            reason: 'Bring Your Own Key is only available on Team and Enterprise plans.',
            requiredPlan: 'team'
          };
        }
        return { allowed: true };

      default:
        return { allowed: true };
    }
  };

  return { checkFeature };
}
