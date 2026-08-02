'use client';

import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '@/sanity/lib/image';
import type { About } from '@/types/about';

export default function AboutSection({ data }: { data: About }) {
  return (
    <section
      id='about'
      className='scroll-mt-24 flex md:flex-row flex-col min-h-screen'
    >
      <div className='md:w-1/2 w-full max-md:order-2 px-5 py-5 md:py-0 pb-20 md:pb-unset flex flex-col justify-center'>
        <div className='flex mb-10 gap-2 justify-between'>
          <div className='flex flex-col'>
            <h1 className='font-bold mb-2'>{data.name}</h1>
            <PortableText value={data.subtitle} />
          </div>
        </div>
        <div className='text-justify'>
          <PortableText value={data.description} />
        </div>
      </div>
      <div className='md:w-1/2 md:h-auto max-md:aspect-square relative max-md:order-1 md:min-h-screen'>
        <Image
          className='object-cover'
          src={urlForImage(data.image)
            .fit('crop')
            .width(1500)
            .height(1500)
            .url()}
          alt={
            data.image?.alt || `${data.name} - Frontend & Shopify Developer`
          }
          fill
          loading='eager'
          placeholder='blur'
          blurDataURL={data.image?.asset?.metadata?.lqip}
        />
      </div>
    </section>
  );
}
