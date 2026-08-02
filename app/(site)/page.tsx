import { Metadata } from 'next';
import SitePage from '@/components/SitePage';

const siteUrl = 'https://adletibraimov.cv';

export const metadata: Metadata = {
  title: 'Adlet Ibraimov | Frontend & Shopify Developer',
  description:
    'Adlet Ibraimov - Frontend, Shopify and Web Developer based in Milan, Italy. Specializing in React, Next.js, Tailwind CSS, and Node.js with e-commerce experience.',
  keywords: [
    'adlet ibraimov',
    'frontend developer',
    'shopify developer',
    'web developer',
    'react developer',
    'milan developer',
  ],
  openGraph: {
    title: 'Adlet Ibraimov | Frontend & Shopify Developer',
    description: 'Frontend, Shopify and Web Developer based in Milan, Italy.',
    url: siteUrl,
  },
};

export default function Home() {
  return <SitePage />;
}
