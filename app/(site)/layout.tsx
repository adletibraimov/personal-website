import '../globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';

import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import { Analytics } from '@vercel/analytics/next';
import { Outfit } from 'next/font/google';

import clsx from 'clsx';
import { Metadata } from 'next';

const siteUrl = 'https://adletibraimov.cv';

const outfit = Outfit({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    default: 'Adlet Ibraimov | Frontend & Shopify Developer',
    template: '%s | Adlet Ibraimov',
  },
  description:
    'Frontend, Shopify and Web Developer based in Milan, Italy. Specializing in React, Next.js, Tailwind CSS, and Node.js. Experience with e-commerce projects for brands like Chiara Ferragni, Off-White, Moschino, and Maserati.',
  keywords: [
    'frontend developer',
    'shopify developer',
    'web developer',
    'fullstack developer',
    'react developer',
    'next.js developer',
    'milan developer',
    'ecommerce developer',
    'tailwind css',
    'node.js',
  ],
  authors: [{ name: 'Adlet Ibraimov', url: siteUrl }],
  creator: 'Adlet Ibraimov',
  publisher: 'Adlet Ibraimov',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    title: 'Adlet Ibraimov | Frontend & Shopify Developer',
    description:
      'Frontend, Shopify and Web Developer based in Milan, Italy. Specializing in React, Next.js, Tailwind CSS, and Node.js.',
    siteName: 'Adlet Ibraimov',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Adlet Ibraimov - Frontend & Shopify Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adlet Ibraimov | Frontend & Shopify Developer',
    description:
      'Frontend, Shopify and Web Developer based in Milan, Italy. Specializing in React, Next.js, Tailwind CSS, and Node.js.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adlet Ibraimov',
    jobTitle: 'Frontend & Shopify Developer',
    url: siteUrl,
    sameAs: [
      'https://github.com/ibrvimv',
      'https://instagram.com/ivluence',
      'https://linkedin.com/in/ibrvimv',
    ],
    description:
      'Frontend, Shopify and Web Developer based in Milan, Italy. Specializing in React, Next.js, Tailwind CSS, and Node.js.',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Milan',
      addressCountry: 'Italy',
    },
    knowsAbout: [
      'React',
      'Next.js',
      'Shopify',
      'Tailwind CSS',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Frontend Development',
      'E-commerce',
    ],
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Adlet Ibraimov',
    url: siteUrl,
    description:
      'Portfolio website of Adlet Ibraimov - Frontend & Shopify Developer based in Milan, Italy.',
    author: {
      '@type': 'Person',
      name: 'Adlet Ibraimov',
    },
  };

  return (
    <html lang='en'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body
        className={clsx(
          outfit.className,
          'm-auto flex flex-col justify-between flex-grow h-screen'
        )}
      >
        <div>
          <Header />
          <main>{children}</main>
        </div>
        <Footer />
        <Analytics />
      </body>
      <GoogleAnalytics gaId='G-VG95DB2TKE' />
    </html>
  );
}
