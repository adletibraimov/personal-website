'use client';

import Image from 'next/image';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@/components/Button';
import { urlForCvMobileImage } from '@/sanity/lib/image';
import type { CV } from '@/types/cv';

export default function CvSection({ data }: { data: CV[] }) {
  const first = data[0];
  const pdfUrl = first?.cvFileUrl;
  const mobileImage = first?.cvMobileImage;
  const mobileImageUrl = mobileImage
    ? urlForCvMobileImage(
        mobileImage as Parameters<typeof urlForCvMobileImage>[0]
      ).url()
    : null;

  return (
    <section id='cv' className='scroll-mt-24 px-3 py-24 min-h-screen'>
      <div className='flex flex-col'>
        <h2 className='font-bold mb-2 uppercase text-5xl md:text-7xl'>
          Curriculum Vitae
        </h2>
      </div>

      {!pdfUrl ? (
        <div className='my-5 mb-10 text-red-400'>
          {`CV PDF is not configured in Admin. Please upload 'CV PDF File' to the 'cv' document.`}
        </div>
      ) : (
        <>
          <div className='my-5 mb-10'>
            <Button icon={DownloadIcon} text='DOWNLOAD CV' value={pdfUrl} />
          </div>
          {mobileImageUrl && (
            <div className='md:hidden w-full bg-white rounded-md overflow-hidden'>
              <Image
                src={mobileImageUrl}
                alt='Curriculum Vitae'
                width={1240}
                height={1754}
                className='w-full h-auto'
                unoptimized
              />
            </div>
          )}
          <div className='hidden md:block w-full h-[120vh] bg-white'>
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className='lg:w-4/5 w-full md:rounded-md h-full mx-auto'
              loading='lazy'
              title='Curriculum Vitae PDF'
            />
          </div>
        </>
      )}
    </section>
  );
}
