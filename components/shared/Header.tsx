'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/components/SmoothScroll';
import config from '../../lib/config';

const SECTION_IDS = config.nav.map((item) => item.id);

/**
 * Floating header with the original projects blend stack
 * (mix-blend-luminosity + #faebd7), border expands on hover.
 */
export default function Header() {
  const [activeId, setActiveId] = useState(SECTION_IDS[0]);
  const lenis = useLenis();

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: 0 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    window.history.replaceState(null, '', `#${id}`);
  }

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      const sections = SECTION_IDS.map((id) =>
        document.getElementById(id)
      ).filter(Boolean) as HTMLElement[];

      if (sections.length < SECTION_IDS.length) return false;

      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible[0]?.target?.id) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          rootMargin: '-20% 0px -55% 0px',
          threshold: [0, 0.25, 0.5, 0.75],
        }
      );

      sections.forEach((section) => observer!.observe(section));
      return true;
    };

    if (setup()) {
      return () => observer?.disconnect();
    }

    const interval = window.setInterval(() => {
      if (setup()) window.clearInterval(interval);
    }, 200);

    return () => {
      window.clearInterval(interval);
      observer?.disconnect();
    };
  }, []);

  return (
    <header className='pointer-events-none fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 mix-blend-luminosity'>
      <nav className='pointer-events-auto mix-blend-luminosity flex flex-row md:gap-4 items-center justify-center bg-[#faebd7] px-3 py-2 md:px-5 md:py-2.5 transition-[padding,box-shadow,transform] duration-300 ease-out hover:px-5 hover:py-3 md:hover:px-8 md:hover:py-3.5  hover:scale-[1.02]'>
        {config.nav.map((item) => (
          <button
            type='button'
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`text-base lg:text-xl px-3 py-2 hover:text-secondary transition-colors duration-100 ${
              activeId === item.id ? 'text-secondary' : 'text-white'
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
