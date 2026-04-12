import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/sanity/sanity-utils';
import { Metadata } from 'next';
import { Suspense } from 'react';

const siteUrl = 'https://adletibraimov.cv';

export const metadata: Metadata = {
  title: 'Projects | Adlet Ibraimov',
  description:
    'Explore Adlet Ibraimov portfolio - Frontend & Shopify Developer. Projects include e-commerce sites for brands like Chiara Ferragni, Off-White, Moschino, and Maserati.',
  keywords: ['adlet ibraimov projects', 'frontend developer portfolio', 'shopify developer projects', 'web developer portfolio', 'ecommerce projects'],
  openGraph: {
    title: 'Projects | Adlet Ibraimov',
    description: 'Explore Adlet Ibraimov portfolio - Frontend & Shopify Developer with e-commerce experience.',
    url: `${siteUrl}/projects`,
  },
};

async function ProjectsContent() {
  const data = await getProjects();

  if (!data)
    return <div>Sorry, for unknown reason projects could not be loaded.</div>;

  return (
    <div className='px-3 py-24'>
      <div className='flex flex-col'>
        <h1 className='font-bold mb-2'>PROJECTS</h1>
      </div>
      <div className='flex flex-wrap gap-6 py-4 justify-center'>
        {data.map((item, key) => (
          <Link
            key={key}
            target='_blank'
            href={item?.url}
            className='flex flex-col items-center gap-4 hover:-translate-x-1 hover:-translate-y-5 hover:text-secondary p-2 transition-all duration-100 flex-1 min-w-[300px] max-w-[calc(33%-1.5rem)]'
          >
            <div className='w-full aspect-video relative'>
              <Image
                className='object-cover'
                src={item?.image?.asset?.url}
                placeholder='blur'
                blurDataURL={item?.image?.asset?.metadata?.lqip}
                alt={item?.image?.alt || `${item?.name} project screenshot`}
                fill={true}
              />
            </div>
            <p className='uppercase text-center'>{item?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <Suspense fallback={<div className='px-3 py-24'>Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
