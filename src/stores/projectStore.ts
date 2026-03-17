import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  lastModified?: string;
  thumbnail?: string;
  type: 'website' | 'mobile' | 'design' | 'dashboard' | 'api' | 'game' | 'ai' | 'extension';
  isPublished?: boolean;
  isArchived?: boolean;
  teamAvatars?: string[];
  teamMembers?: { name: string; avatar: string }[];
  techStack?: string[];
  mode?: 'builder' | 'ide';
  template?: string;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Project) => void;
  createProject: (project: Partial<Project>) => string;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  duplicateProject: (id: string) => void;
  archiveProject: (id: string) => void;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Tesseract Landing',
    description: 'The main landing page for Tesseract platform.',
    lastEdited: '2h ago',
    lastModified: '2h ago',
    type: 'website',
    teamAvatars: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2'],
    teamMembers: [
      { name: 'Marko', avatar: 'https://i.pravatar.cc/150?u=1' },
      { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=2' }
    ],
    techStack: ['React', 'Tailwind', 'Vite']
  },
  {
    id: '2',
    name: 'Fitness Tracker',
    description: 'Mobile-first fitness tracking application.',
    lastEdited: '5h ago',
    lastModified: '5h ago',
    type: 'mobile',
    teamAvatars: ['https://i.pravatar.cc/150?u=3'],
    teamMembers: [
      { name: 'Marko', avatar: 'https://i.pravatar.cc/150?u=3' }
    ],
    techStack: ['React Native', 'Firebase']
  },
  {
    id: '3',
    name: 'Sales Dashboard',
    description: 'Internal dashboard for retail sales tracking.',
    lastEdited: '1d ago',
    lastModified: '1d ago',
    type: 'dashboard',
    teamAvatars: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6'],
    teamMembers: [
      { name: 'Marko', avatar: 'https://i.pravatar.cc/150?u=4' },
      { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=5' },
      { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=6' }
    ],
    techStack: ['React', 'D3.js']
  },
  {
    id: '4',
    name: 'AI Image Gen',
    description: 'A simple wrapper around Stable Diffusion.',
    lastEdited: '3d ago',
    lastModified: '3d ago',
    type: 'ai',
    teamAvatars: ['https://i.pravatar.cc/150?u=7'],
    teamMembers: [
      { name: 'Marko', avatar: 'https://i.pravatar.cc/150?u=7' }
    ],
    techStack: ['Python', 'React']
  }
];

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: MOCK_PROJECTS,
      addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
      createProject: (projectData) => {
        const id = Math.random().toString(36).substring(7);
        const newProject: Project = {
          id,
          name: projectData.name || 'Untitled Project',
          description: projectData.description || '',
          lastEdited: 'Just now',
          lastModified: 'Just now',
          type: projectData.type || 'website',
          ...projectData
        } as Project;
        set((state) => ({ projects: [newProject, ...state.projects] }));
        return id;
      },
      deleteProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),
      duplicateProject: (id) => set((state) => {
        const project = state.projects.find((p) => p.id === id);
        if (!project) return state;
        const newProject = { ...project, id: Math.random().toString(36).substring(7), name: `${project.name} (Copy)` };
        return { projects: [newProject, ...state.projects] };
      }),
      archiveProject: (id) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, isArchived: true } : p)
      })),
    }),
    {
      name: 'tesseract-projects',
    }
  )
);
