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
  const identity = beats[0];
  const bioBeats = beats.slice(1);
  const catchphrase = 'yep, this is me:)';
  const scalesNote =
    'Fullstack — but I am more experienced in frontend';

  // Extra scroll room for longer holds on identity / bio beats
  const storyHeightVh = 500 + bioBeats.length * 190;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      const intro = section.querySelector<HTMLElement>('.about-intro');
      const story = section.querySelector<HTMLElement>('.about-story');
      const hiEl = section.querySelector<HTMLElement>('.about-hi');
      const catchphraseEl =
        section.querySelector<HTMLElement>('.about-catchphrase');
      const portrait = section.querySelector<HTMLElement>('.about-portrait');
      const introCluster =
        section.querySelector<HTMLElement>('.about-intro-cluster');
      const identityEl =
        section.querySelector<HTMLElement>('.about-identity');
      const scalesEl = section.querySelector<HTMLElement>('.about-scales');
      const scalesNoteEl =
        section.querySelector<HTMLElement>('.about-scales-note');
      const backendEl = section.querySelector<HTMLElement>('.about-backend');
      const frontendEl =
        section.querySelector<HTMLElement>('.about-frontend');
      const beamEl = section.querySelector<HTMLElement>('.about-beam');
      const fulcrumEl =
        section.querySelector<HTMLElement>('.about-fulcrum');
      const bioEls = gsap.utils.toArray<HTMLElement>('.about-bio-block');

      if (prefersReducedMotion) {
        gsap.set(
          [
            hiEl,
            catchphraseEl,
            identityEl,
            scalesEl,
            scalesNoteEl,
            backendEl,
            frontendEl,
            beamEl,
            fulcrumEl,
            ...bioEls,
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, clearProps: 'all' }
        );
        return;
      }

      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      // Half-distance from center so labels sit left/right of the fulcrum
      const pairGap = isMobile ? 92 : 168;

      gsap.set(hiEl, { opacity: 0, y: isMobile ? -10 : -18 });
      gsap.set(catchphraseEl, { opacity: 0, y: isMobile ? 10 : 18 });
      gsap.set(portrait, { scale: 0.96 });
      gsap.set(identityEl, { opacity: 0, y: 28 });
      gsap.set(scalesEl, { opacity: 0 });
      gsap.set(scalesNoteEl, { opacity: 0, x: isMobile ? -18 : -36 });
      // Backend starts centered alone; later shifts left when Frontend joins
      gsap.set(backendEl, { opacity: 0, y: 20, x: 0 });
      gsap.set(frontendEl, {
        opacity: 0,
        y: 20,
        x: isMobile ? 18 : 36,
      });
      gsap.set(beamEl, { opacity: 0, scaleX: 0.35, rotate: 0 });
      gsap.set(fulcrumEl, { opacity: 0, y: 8 });
      gsap.set(bioEls, { opacity: 0, x: isMobile ? -24 : -48 });

      // 1) Sticky intro: Hi → catchphrase → hold → exit upward
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.65,
        },
      });

      introTl
        .to(portrait, { scale: 1, duration: 1, ease: 'none' }, 0)
        .to(hiEl, { opacity: 1, y: 0, duration: 0.85, ease: 'none' }, 0.85)
        .to({}, { duration: 1.1 }, 1.7)
        .to(
          catchphraseEl,
          { opacity: 1, y: 0, duration: 0.95, ease: 'none' },
          2.8
        )
        // Longer dwell with both labels visible
        .to({}, { duration: 2.4 }, 3.75)
        .to(
          introCluster,
          { y: '-42vh', opacity: 0, duration: 1.6, ease: 'none' },
          6.15
        );

      // 2) Sticky black story: identity → scales → note → bio beats
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });

      storyTl
        // Identity
        .to(
          identityEl,
          { opacity: 1, y: 0, duration: 1.1, ease: 'none' },
          0.15
        )
        // Longer hold on "I am Adlet Ibraimov"
        .to({}, { duration: 3.2 }, 1.25)
        // Identity leaves
        .to(
          identityEl,
          { opacity: 0, y: -36, duration: 0.9, ease: 'none' },
          4.45
        )
        // Scales stage in
        .to(scalesEl, { opacity: 1, duration: 0.35, ease: 'none' }, 5.2)
        // Backend alone, centered
        .to(
          backendEl,
          { opacity: 1, y: 0, duration: 0.85, ease: 'none' },
          5.35
        )
        .to({}, { duration: 0.75 }, 6.2)
        // Frontend joins on the right; Backend shifts left into scale pose
        .to(
          backendEl,
          { x: -pairGap, duration: 0.9, ease: 'none' },
          6.95
        )
        .to(
          frontendEl,
          { opacity: 1, y: 0, x: pairGap, duration: 0.9, ease: 'none' },
          6.95
        )
        .to({}, { duration: 0.55 }, 7.85)
        // Beam + fulcrum appear (scale under the words)
        .to(
          fulcrumEl,
          { opacity: 1, y: 0, duration: 0.5, ease: 'none' },
          8.4
        )
        .to(
          beamEl,
          { opacity: 1, scaleX: 1, duration: 0.7, ease: 'none' },
          8.5
        )
        .to({}, { duration: 0.45 }, 9.2)
        // Tip the scale: Frontend heavier (down), Backend lighter (up)
        .to(
          backendEl,
          { y: isMobile ? -28 : -42, duration: 1.45, ease: 'none' },
          9.65
        )
        .to(
          frontendEl,
          { y: isMobile ? 34 : 52, duration: 1.45, ease: 'none' },
          9.65
        )
        .to(
          beamEl,
          { rotate: isMobile ? 11 : 14, duration: 1.45, ease: 'none' },
          9.65
        )
        .to({}, { duration: 1.4 }, 11.1)
        // Caption under the scales
        .to(
          scalesNoteEl,
          { opacity: 1, x: 0, duration: 1.1, ease: 'none' },
          12.5
        )
        // Longer dwell with scales + note
        .to({}, { duration: 2.6 }, 13.6);

      let t = 16.2;

      bioEls.forEach((el, i) => {
        const isLast = i === bioEls.length - 1;
        // Extra hold for bio beats (e.g. "open to contracts")
        const hold = isLast ? 4.4 : 3.8;

        if (i === 0) {
          // Scales + note leave before first bio
          storyTl.to(
            scalesEl,
            { opacity: 0, y: -28, duration: 0.85, ease: 'none' },
            t
          );
          t += 0.8;
        } else {
          // Previous bio leaves
          storyTl.to(
            bioEls[i - 1],
            { opacity: 0, x: isMobile ? 18 : 36, duration: 0.7, ease: 'none' },
            t
          );
          t += 0.65;
        }

        storyTl.to(
          el,
          { opacity: 1, x: 0, duration: 1.05, ease: 'none' },
          t
        );
        t += 1.05;
        storyTl.to({}, { duration: hold }, t);
        t += hold;
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => ctx.revert();
  }, [data, bioBeats.length]);

  const imageSrc = urlForImage(data.image)
    .fit('crop')
    .width(1200)
    .height(1500)
    .url();

  const imageAlt =
    data.image?.alt ||
    `${catchphrase} — Adlet Ibraimov, Frontend & Shopify Developer`;

  const identityTitle = identity?.title || 'I am Adlet Ibraimov';
  const identitySubtitle = 'Fullstack developer';

  return (
    <section
      ref={sectionRef}
      id='about'
      className='about-section relative z-10 bg-[#0a0a0a] text-white'
      aria-label='About me'
    >
      {/* Sticky intro: Hi → catchphrase, then exits upward */}
      <div className='about-intro relative h-[360vh]'>
        <div className='sticky top-0 flex h-screen w-full items-center justify-center px-5'>
          <div className='about-intro-cluster relative flex flex-col items-center will-change-transform'>
            <p className='about-hi z-20 mb-4 w-max text-center text-sm font-medium leading-snug tracking-tight text-white will-change-transform md:mb-5 md:text-base lg:text-lg'>
              hi
            </p>

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

            <p className='about-catchphrase z-20 mt-4 w-max max-w-[12rem] text-center text-sm font-medium leading-snug tracking-tight text-white will-change-transform md:mt-5 md:max-w-[16rem] md:text-base lg:text-lg'>
              {catchphrase}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky black story: identity → scales → note → bio */}
      <div
        className='about-story relative bg-[#0a0a0a]'
        style={{ height: `${storyHeightVh}vh` }}
      >
        <div className='sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5 md:px-10'>
          <div className='relative flex h-full w-full max-w-5xl items-center justify-center'>
            <div className='about-identity absolute inset-x-0 flex flex-col items-center px-2 text-center will-change-transform'>
              <h2 className='text-[clamp(1.75rem,6vw,4.5rem)] font-bold uppercase leading-[1.05]'>
                {identityTitle}
              </h2>
              <p className='mt-3 max-w-xl text-base tracking-wide text-white/65 md:mt-5 md:text-2xl lg:text-3xl'>
                {identitySubtitle}
              </p>
            </div>

            <div className='about-scales absolute inset-x-0 flex flex-col items-center will-change-transform'>
              <div className='relative flex h-[4.5rem] w-full max-w-3xl items-center justify-center md:h-[5.5rem]'>
                <p className='about-backend absolute text-center text-2xl font-bold uppercase tracking-tight will-change-transform md:text-5xl lg:text-6xl'>
                  Backend
                </p>
                <p className='about-frontend absolute text-center text-2xl font-bold uppercase tracking-tight will-change-transform md:text-5xl lg:text-6xl'>
                  Frontend
                </p>
              </div>

              {/* Scale / seesaw under the labels */}
              <div
                className='relative mt-8 flex w-full max-w-md flex-col items-center md:mt-12 md:max-w-xl'
                aria-hidden
              >
                <div className='about-beam h-[2px] w-full origin-center bg-white/80 will-change-transform' />
                <div className='about-fulcrum mt-0 flex flex-col items-center will-change-transform'>
                  <div className='h-0 w-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-white/85 md:border-l-[14px] md:border-r-[14px] md:border-t-[22px]' />
                  <div className='mt-1 h-8 w-px bg-white/35 md:h-10' />
                </div>
              </div>

              <p className='about-scales-note mt-6 max-w-xs px-2 text-center text-sm font-medium leading-snug tracking-wide text-white/60 will-change-transform md:mt-8 md:max-w-md md:text-base'>
                {scalesNote}
              </p>

              <p className='sr-only'>
                Visual metaphor: Frontend weighs heavier than Backend,
                showing stronger frontend expertise.
              </p>
            </div>

            {bioBeats.map((beat) => (
              <div
                key={beat._key}
                className='about-bio-block absolute inset-x-0 mx-auto flex max-w-3xl flex-col items-start px-2 text-left will-change-transform'
              >
                <h3 className='mb-4 text-[clamp(1.75rem,5vw,3.75rem)] font-bold uppercase leading-[1.05] tracking-tight text-white md:mb-6'>
                  {beat.title}
                </h3>
                <p className='max-w-3xl text-[clamp(1.05rem,2.4vw,1.75rem)] leading-relaxed text-white/70'>
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
