'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { urlForImage } from '@/sanity/lib/image';
import type { About } from '@/types/about';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection({ data }: { data: About }) {
  const sectionRef = useRef<HTMLElement>(null);
  const beats = data.beats ?? [];
  const catchphrase = data.catchphrase || 'Yep, this is me!';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      const intro = section.querySelector<HTMLElement>('.about-intro');
      const story = section.querySelector<HTMLElement>('.about-story');
      const catchphraseEl =
        section.querySelector<HTMLElement>('.about-catchphrase');
      const portrait = section.querySelector<HTMLElement>('.about-portrait');
      const beatEls = gsap.utils.toArray<HTMLElement>('.about-beat');

      if (prefersReducedMotion) {
        gsap.set(catchphraseEl, { opacity: 1, x: 0 });
        gsap.set(beatEls, { opacity: 1, x: 0, y: 0 });
        return;
      }

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      gsap.set(catchphraseEl, { opacity: 0, x: isMobile ? 12 : 28 });
      gsap.set(portrait, { scale: 0.96 });
      gsap.set(beatEls, { opacity: 0, x: isMobile ? -12 : -28 });

      // Sticky intro: photo → small catchphrase on the right → hold
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      introTl
        .to(portrait, { scale: 1, duration: 1, ease: 'none' }, 0)
        .to(
          catchphraseEl,
          { opacity: 1, x: 0, duration: 0.9, ease: 'none' },
          1.15
        )
        .to({}, { duration: 2.2 }, 2.05);

      // Sticky story: same scrub style — beats appear one by one on the left
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      beatEls.forEach((beat, index) => {
        const start = index * 1.35;
        storyTl.to(
          beat,
          { opacity: 1, x: 0, duration: 0.85, ease: 'none' },
          start
        );
      });

      // hold after last beat so text can be read before unpin
      storyTl.to({}, { duration: 3.2 }, beatEls.length * 1.35);

      // Lenis / late layout: recalc trigger positions
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [data]);

  const imageSrc = urlForImage(data.image)
    .fit('crop')
    .width(1200)
    .height(1500)
    .url();

  const imageAlt =
    data.image?.alt ||
    `${catchphrase} — Adlet Ibraimov, Frontend & Shopify Developer`;

  return (
    <section
      ref={sectionRef}
      id='about'
      className='about-section relative z-10 bg-[#0a0a0a] text-white'
      aria-label='About me'
    >
      {/* Sticky intro: centered photo, small catchphrase to the right, then hold */}
      <div className='about-intro relative h-[280vh]'>
        <div className='sticky top-0 flex h-screen w-full items-center justify-center px-5'>
          <div className='relative'>
            <div className='about-portrait relative z-10 aspect-[4/5] w-[min(52vw,240px)] will-change-transform md:w-[min(36vw,360px)]'>
              <div className='relative h-full w-full overflow-hidden'>
                <Image
                  className='object-cover'
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes='(max-width: 768px) 52vw, 360px'
                  priority
                  placeholder={
                    data.image?.asset?.metadata?.lqip ? 'blur' : 'empty'
                  }
                  blurDataURL={data.image?.asset?.metadata?.lqip}
                />
              </div>
            </div>

            <p className='about-catchphrase absolute left-full top-1/2 z-20 ml-2 w-max max-w-[6.5rem] -translate-y-1/2 text-left text-sm font-medium leading-snug tracking-tight text-white/90 will-change-transform md:ml-4 md:max-w-[12rem] md:text-base lg:text-lg'>
              {catchphrase}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky black story: beats scrub in one by one on the left */}
      <div className='about-story relative h-[350vh] bg-[#0a0a0a]'>
        <div className='sticky top-0 flex h-screen items-center px-5 md:px-10 lg:px-16'>
          <div className='mx-auto flex w-full max-w-6xl flex-col justify-center gap-8 md:gap-10'>
            {beats.map((beat) => (
              <div
                key={beat._key}
                className='about-beat max-w-xl text-left will-change-transform md:max-w-2xl'
              >
                <h2 className='about-beat-title mb-2 text-2xl uppercase leading-tight tracking-tight md:mb-3 md:text-4xl lg:text-5xl'>
                  {beat.title}
                </h2>
                <p className='about-beat-description text-base leading-relaxed text-white/70 md:text-xl lg:text-2xl'>
                  {beat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
