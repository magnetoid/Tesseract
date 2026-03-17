import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../components/shell/AppShell';
import { useProjectStore } from '../stores/projectStore';

export function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjectStore();
  
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (project) {
      // Logic to load project data into stores if needed
      console.log(`Loading project: ${project.name}`);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0c] text-[#e8e8ed]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <p className="text-[#6b6b7a] mt-2">The project you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return <AppShell />;
}
