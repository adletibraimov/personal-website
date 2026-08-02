'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/types/project';

gsap.registerPlugin(ScrollTrigger);

const REEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const REEL_LENGTH = 8;

// Lean while scrolling (deg). Top viewport: \  | |  /   bottom: /  | |  \
// Middle viewport stays straight. Settles flat when scroll stops.
const MAX_LEAN = 55;
const VELOCITY_REF = 60; // lower = reaches full lean at slower scroll
const DEAD_ZONE = 0.12;
const MIN_SCROLL_STRENGTH = 0.7; // always visible while scrolling
const SETTLE_MS = 220;

type ProjectsGridProps = {
  projects: Project[];
};

function buildReel(finalChar: string, seed: number) {
  const upper = finalChar.toUpperCase();
  if (finalChar === ' ') {
    return Array.from({ length: REEL_LENGTH }, () => '\u00A0');
  }

  const reel = Array.from({ length: REEL_LENGTH - 1 }, (_, i) => {
    const idx = (seed * 17 + i * 31) % REEL_CHARS.length;
    return REEL_CHARS[idx];
  });
  reel.push(upper);
  return reel;
}

function SlotTitle({ name }: { name: string }) {
  const chars = name.split('');

  return (
    <p
      className='project-title uppercase text-center text-xl md:text-2xl lg:text-3xl tracking-wide flex flex-wrap justify-center gap-x-[0.05em] leading-none'
      aria-label={name}
    >
      {chars.map((char, index) => {
        const reel = buildReel(char, index);
        const isSpace = char === ' ';

        return (
          <span
            key={`${char}-${index}`}
            className='project-title-char inline-block overflow-hidden h-[1.1em] align-bottom'
            aria-hidden='true'
          >
            <span
              className='project-title-reel flex flex-col items-center'
              data-space={isSpace ? 'true' : undefined}
            >
              {reel.map((reelChar, reelIndex) => (
                <span
                  key={reelIndex}
                  className='block h-[1.1em] leading-[1.1em] tracking-tight'
                >
                  {reelChar}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </p>
  );
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const settleFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const triggers = gsap.utils.toArray<HTMLElement>('.project-trigger');
      const bendEls = gsap.utils.toArray<HTMLElement>('.project-bend');

      // —— Entrance: media frame scaleX 0.8→1; image counter-scales so it stays cover ——
      triggers.forEach((trigger) => {
        const media = trigger.querySelector<HTMLElement>('.project-media');
        const mediaImg = trigger.querySelector<HTMLElement>('.project-media-img');
        const card = trigger.querySelector<HTMLElement>('.project-card');
        if (!media || !mediaImg || !card) return;

        const reels = card.querySelectorAll<HTMLElement>(
          '.project-title-reel:not([data-space="true"])'
        );

        if (prefersReducedMotion) {
          gsap.set([media, mediaImg], { scaleX: 1 });
          reels.forEach((reel) => {
            gsap.set(reel, { y: `-${(reel.children.length - 1) * 1.1}em` });
          });
          return;
        }

        // Frame shrinks; image scales up by 1/0.8 so pixels aren't squished
        gsap.set(media, { scaleX: 0.8, transformOrigin: '50% 50%' });
        gsap.set(mediaImg, { scaleX: 1.25, transformOrigin: '50% 50%' });
        gsap.set(reels, { y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        tl.to(
          media,
          { scaleX: 1, duration: 0.85, ease: 'power2.out' },
          0
        )
          .to(
            mediaImg,
            { scaleX: 1, duration: 0.85, ease: 'power2.out' },
            0
          )
          .to(
            reels,
            {
              y: (_, el) => `-${(el.children.length - 1) * 1.1}em`,
              duration: 0.65,
              ease: 'power2.inOut',
              stagger: 0.02,
            },
            0.08
          );
      });

      if (prefersReducedMotion || bendEls.length === 0) return;

      // —— Viewport lean (not cylinder) ——
      // scrolling + top zone:    \  | |  /
      // scrolling + middle:      |  | |  |   (dead zone — no lean)
      // scrolling + bottom zone: /  | |  \
      // idle: everything flat
      gsap.set(bendEls, {
        transformOrigin: '50% 50%',
        force3D: true,
        rotationZ: 0,
      });

      // Snappy follow — old 0.4s ease never reached full lean before settle
      const rotationZTo = bendEls.map((el) =>
        gsap.quickTo(el, 'rotationZ', { duration: 0.12, ease: 'power2.out' })
      );

      const flatten = () => {
        bendEls.forEach((_, i) => rotationZTo[i](0));
      };

      /** Map card Y in viewport → zone factor: -1 top, 0 middle, +1 bottom */
      const zoneFactor = (cardMidY: number, vh: number) => {
        const offset = (cardMidY - vh * 0.5) / (vh * 0.5); // -1..1
        const abs = Math.abs(offset);
        if (abs <= DEAD_ZONE) return 0;
        const t = (abs - DEAD_ZONE) / (1 - DEAD_ZONE);
        // Ease out so edges hit full lean sooner
        return Math.sign(offset) * Math.pow(t, 0.65);
      };

      const applyBend = (strength: number) => {
        const vh = window.innerHeight;
        const s = gsap.utils.clamp(0, 1, strength);

        if (s < 0.02) {
          flatten();
          return;
        }

        bendEls.forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -40 || rect.top > vh + 40) {
            rotationZTo[i](0);
            return;
          }

          const zone = zoneFactor(rect.top + rect.height * 0.5, vh);
          if (zone === 0) {
            rotationZTo[i](0);
            return;
          }

          // Top zone: left `\`, right `/`  |  Bottom zone: left `/`, right `\`
          const isRight = el.dataset.col === 'right';
          const lean = (isRight ? 1 : -1) * zone * MAX_LEAN * s;
          rotationZTo[i](lean);
        });
      };

      let lastY = window.scrollY;
      let lastTs = performance.now();
      let settleTimer: ReturnType<typeof setTimeout> | undefined;

      const onScroll = () => {
        const now = performance.now();
        const dt = Math.max(now - lastTs, 1);
        const y = window.scrollY;
        const delta = Math.abs(y - lastY);
        lastY = y;
        lastTs = now;

        const pxPerSec = (delta / dt) * 1000;
        const fromSpeed = pxPerSec / VELOCITY_REF;
        // Floor strength so bend is always obvious while scrolling
        const strength = Math.max(MIN_SCROLL_STRENGTH, fromSpeed);
        applyBend(strength);

        clearTimeout(settleTimer);
        settleTimer = setTimeout(flatten, SETTLE_MS);
      };

      // Native scroll is more reliable than ST onUpdate for trackpads
      window.addEventListener('scroll', onScroll, { passive: true });

      const settle = () => flatten();
      window.addEventListener('scrollend', settle, { passive: true });
      ScrollTrigger.addEventListener('scrollEnd', settle);

      settleFns.push(() => {
        clearTimeout(settleTimer);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('scrollend', settle);
        ScrollTrigger.removeEventListener('scrollEnd', settle);
      });
    }, container);

    return () => {
      settleFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, [projects]);

  return (
    <section
      id='projects'
      ref={containerRef}
      className='scroll-mt-24 px-3 py-24 min-h-screen'
    >
      <div className='flex flex-col'>
        <h2 className='font-bold mb-2 text-5xl md:text-7xl'>PROJECTS</h2>
      </div>

      {/* Dedicated perspective wrapper — CSS grid alone often kills 3D */}
      <div
        className='project-perspective lg:mx-32'
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 45%',
        }}
      >
        <div
          className='project-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 py-4'
          style={{ transformStyle: 'preserve-3d' }}
        >
          {projects.map((item, index) => (
            <div
              key={item._id}
              className='project-trigger w-full'
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className='project-bend w-full'
                data-col={index % 2 === 0 ? 'left' : 'right'}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className='project-card w-full'>
                  <Link
                    target='_blank'
                    href={item.url}
                    className='flex flex-col items-center gap-5 hover:-translate-y-2 hover:text-secondary p-2 transition-transform duration-200'
                  >
                    <div className='project-media w-full aspect-video relative overflow-hidden will-change-transform'>
                      <div className='project-media-img absolute inset-0 will-change-transform'>
                        <Image
                          className='object-cover object-center'
                          src={item.image?.asset?.url}
                          placeholder='blur'
                          blurDataURL={item.image?.asset?.metadata?.lqip}
                          alt={
                            item.image?.alt || `${item.name} project screenshot`
                          }
                          fill
                          sizes='(max-width: 768px) 100vw, 50vw'
                        />
                      </div>
                    </div>
                    <SlotTitle name={item.name} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
