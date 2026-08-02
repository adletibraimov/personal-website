'use client';

import dynamic from 'next/dynamic';
import type { Project } from '@/types/project';

const ProjectsGrid = dynamic(() => import('./ProjectsGrid'), {
  ssr: false,
  loading: () => <div className='px-3 py-24'>Loading projects...</div>,
});

export default function ProjectsGridClient({
  projects,
}: {
  projects: Project[];
}) {
  return <ProjectsGrid projects={projects} />;
}
