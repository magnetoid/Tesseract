import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TestStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface TestStep {
  id: string;
  description: string;
  status: 'pending' | 'pass' | 'fail';
  timestamp: number;
  screenshot?: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
}

export interface TestResult {
  passed: number;
  total: number;
  duration: number;
  issues: {
    id: string;
    title: string;
    description: string;
    screenshot: string;
  }[];
}

interface TestingState {
  status: TestStatus;
  currentScenarioId: string | null;
  scenarios: TestScenario[];
  steps: TestStep[];
  results: TestResult | null;
  elapsedTime: number;
  
  // Actions
  startTest: (scenarioId: string) => void;
  stopTest: () => void;
  resetTest: () => void;
  addScenario: (name: string, description: string) => void;
  removeScenario: (id: string) => void;
  tick: () => void;
  completeTest: (success: boolean) => void;
}

const DEFAULT_SCENARIOS: TestScenario[] = [
  { id: 'scen-1', name: 'Login Flow', description: 'Tests user authentication and redirect to dashboard', isCustom: false },
  { id: 'scen-2', name: 'Sign Up Flow', description: 'Tests new user registration and onboarding', isCustom: false },
  { id: 'scen-3', name: 'Navigation', description: 'Verifies all sidebar links and page routing', isCustom: false },
  { id: 'scen-4', name: 'Form Validation', description: 'Checks error messages for invalid inputs', isCustom: false },
  { id: 'scen-5', name: 'Responsive Layout', description: 'Tests UI on mobile and tablet viewports', isCustom: false },
];

export const useTestingStore = create<TestingState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      currentScenarioId: null,
      scenarios: DEFAULT_SCENARIOS,
      steps: [],
      results: null,
      elapsedTime: 0,

      startTest: (scenarioId) => {
        set({ 
          status: 'running', 
          currentScenarioId: scenarioId, 
          steps: [], 
          results: null, 
          elapsedTime: 0 
        });
      },

      stopTest: () => set({ status: 'idle', currentScenarioId: null }),

      resetTest: () => set({ status: 'idle', currentScenarioId: null, steps: [], results: null, elapsedTime: 0 }),

      addScenario: (name, description) => set((state) => ({
        scenarios: [...state.scenarios, { id: `scen-${Date.now()}`, name, description, isCustom: true }]
      })),

      removeScenario: (id) => set((state) => ({
        scenarios: state.scenarios.filter(s => s.id !== id)
      })),

      tick: () => set((state) => ({ elapsedTime: state.elapsedTime + 1 })),

      completeTest: (success) => {
        const { steps, elapsedTime } = get();
        const passedSteps = steps.filter(s => s.status === 'pass').length;
        
        const mockIssues = success ? [] : [
          {
            id: 'issue-1',
            title: 'Sign up form validation error',
            description: "The sign up form doesn't show an error message when an invalid email is entered.",
            screenshot: 'https://picsum.photos/seed/error1/400/225'
          }
        ];

        set({
          status: success ? 'completed' : 'failed',
          results: {
            passed: passedSteps,
            total: steps.length,
            duration: elapsedTime,
            issues: mockIssues
          }
        });
      }
    }),
    {
      name: 'tesseract-testing-storage',
    }
  )
);
