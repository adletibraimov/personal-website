import React from 'react';
import Image from 'next/image';
import { getCV } from '@/sanity/sanity-utils';
import { urlForCvMobileImage } from '@/sanity/lib/image';
import Button from '@/components/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { Metadata } from 'next';

const siteUrl = 'https://adletibraimov.cv';

export const metadata: Metadata = {
  title: 'Curriculum Vitae | Adlet Ibraimov',
  description:
    'Download Adlet Ibraimov CV - Frontend & Shopify Developer with experience in React, Next.js, Tailwind CSS, and Node.js. Based in Milan, Italy.',
  keywords: ['adlet ibraimov cv', 'frontend developer resume', 'shopify developer cv', 'web developer portfolio', 'react developer milan'],
  openGraph: {
    title: 'Curriculum Vitae | Adlet Ibraimov',
    description: 'Download Adlet Ibraimov CV - Frontend & Shopify Developer with experience in React, Next.js, and Shopify.',
    url: `${siteUrl}/cv`,
  },
};

export default async function CV() {
  const data = await getCV();

  if (!data) return <div>{`Sorry CV is not avaiable now:(`}</div>;

  const first = data[0];
  const pdfUrl = first?.cvFileUrl;
  const mobileImage = first?.cvMobileImage;
  const mobileImageUrl = mobileImage
    ? urlForCvMobileImage(mobileImage as Parameters<typeof urlForCvMobileImage>[0]).url()
    : null;

  if (!pdfUrl) {
    return (
      <div className='px-3 overflow-y-auto py-24'>
        <div className='my-5 mb-10'>
          <div className='text-red-400'>
            {`CV PDF is not configured in Admin. Please upload 'CV PDF File' to the 'cv' document.`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-3 overflow-y-auto py-24'>
      <div className='flex flex-col'>
        <h1 className='font-bold mb-2 uppercase'>Curriculum Vitae</h1>
      </div>
      <div className='my-5 mb-10'>
        <Button icon={DownloadIcon} text='DOWNLOAD CV' value={pdfUrl} />
      </div>
      {/* Mobile: show long PNG/JPG version from Sanity for better scrolling/zoom UX */}
      {mobileImageUrl && (
        <div className='md:hidden w-full bg-white rounded-md overflow-hidden'>
          <Image
            src={mobileImageUrl}
            alt='Curriculum Vitae'
            width={1240}
            height={1754}
            className='w-full h-auto'
            unoptimized
            priority
          />
        </div>
      )}
      {/* Tablet / Desktop: embedded PDF viewer */}
      <div className='hidden md:block w-full h-[120vh] bg-white'>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className='lg:w-4/5 w-full md:rounded-md h-full mx-auto'
          loading='lazy'
        />
      </div>
    </div>
  );
}
