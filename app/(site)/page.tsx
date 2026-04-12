import React from 'react';
import Image from 'next/image';
import { getAbout } from '@/sanity/sanity-utils';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '@/sanity/lib/image';
import { Metadata } from 'next';

const siteUrl = 'https://adletibraimov.cv';

export const metadata: Metadata = {
  title: 'Home | Adlet Ibraimov',
  description:
    'Adlet Ibraimov - Frontend, Shopify and Web Developer based in Milan, Italy. Specializing in React, Next.js, Tailwind CSS, and Node.js with e-commerce experience.',
  keywords: ['adlet ibraimov', 'frontend developer', 'shopify developer', 'web developer', 'react developer', 'milan developer'],
  openGraph: {
    title: 'Adlet Ibraimov | Frontend & Shopify Developer',
    description: 'Frontend, Shopify and Web Developer based in Milan, Italy.',
    url: siteUrl,
  },
};

export default async function Home() {
  const data = await getAbout();
  if (!data) return <div>Sorry service is not available!</div>;

  return (
    <div className=' flex md:flex-row flex-col h-screen'>
      {/* <video
        className='absolute -z-10 inset-0 object-cover opacity-30  h-full w-full'
        autoPlay
        muted
        loop
        controls={false}
      >
        <source src='steam15.mp4' type='video/mp4' />
      </video> */}
      <div className='md:w-1/2 w-full max-md:order-2 px-5 py-5 md:py-0 pb-20  md:pb-unset flex flex-col justify-center '>
        <div className='flex mb-10 gap-2 justify-between '>
          <div className='flex flex-col'>
            <h1 className='font-bold mb-2'>{data.name}</h1>
            <PortableText value={data.subtitle} />
          </div>
        </div>
        <div className='text-justify '>
          <PortableText value={data.description} />
        </div>
      </div>
      <div className='md:w-1/2  md:h-auto max-md:aspect-square  relative max-md:order-1 '>
        {/* <div
          className='absolute inset-0 z-30  '
          style={{ boxShadow: '0 0 7px 7px #fff inset' }}
        ></div> */}
        <Image
          className='object-cover'
          src={urlForImage(data.image).fit('crop').width(1500).height(1500).url()}
          alt={data.image?.alt || `${data.name} - Frontend & Shopify Developer`}
          fill={true}
          loading='eager'
          placeholder='blur'
          blurDataURL={data.image?.asset?.metadata?.lqip}
        />
      </div>
    </div>
  );
}
