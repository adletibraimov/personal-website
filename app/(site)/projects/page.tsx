import { getProjects } from '@/sanity/sanity-utils';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectsGridClient from '@/components/projects/ProjectsGridClient';

const siteUrl = 'https://adletibraimov.cv';

export const metadata: Metadata = {
  title: 'Projects | Adlet Ibraimov',
  description:
    'Explore Adlet Ibraimov portfolio - Frontend & Shopify Developer. Projects include e-commerce sites for brands like Chiara Ferragni, Off-White, Moschino, and Maserati.',
  keywords: [
    'adlet ibraimov projects',
    'frontend developer portfolio',
    'shopify developer projects',
    'web developer portfolio',
    'ecommerce projects',
  ],
  openGraph: {
    title: 'Projects | Adlet Ibraimov',
    description:
      'Explore Adlet Ibraimov portfolio - Frontend & Shopify Developer with e-commerce experience.',
    url: `${siteUrl}/projects`,
  },
};

async function ProjectsContent() {
  const data = await getProjects();

  if (!data) {
    return <div>Sorry, for unknown reason projects could not be loaded.</div>;
  }

  return <ProjectsGridClient projects={data} />;
}

export default function Projects() {
  return (
    <Suspense fallback={<div className='px-3 py-24'>Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
