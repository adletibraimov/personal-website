'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/components/SmoothScroll';
import {
  getAbout,
  getContacts,
  getCV,
  getProjects,
} from '@/sanity/sanity-utils';
import type { About } from '@/types/about';
import type { CV } from '@/types/cv';
import type { Project } from '@/types/project';
import type { Contact } from '@/types/contact';
import AboutSection from '@/components/sections/AboutSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

type SiteData = {
  about: About | null;
  cv: CV[] | null;
  projects: Project[] | null;
  contacts: Contact[] | null;
};

export default function SitePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let cancelled = false;

    Promise.all([getAbout(), getCV(), getProjects(), getContacts()])
      .then(([about, cv, projects, contacts]) => {
        if (cancelled) return;
        setData({ about, cv, projects, contacts });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    const frame = requestAnimationFrame(() => {
      setRevealed(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [data]);

  useEffect(() => {
    if (!data || !revealed) return;

    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id) return;

      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;

        if (lenis) {
          lenis.scrollTo(el, { offset: 0 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [data, revealed, lenis]);

  return (
    <>
      <div
        aria-hidden={!error}
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ease-out ${
          revealed || error
            ? 'pointer-events-none opacity-0'
            : 'opacity-100'
        }`}
      >
        {error ? (
          <p className='px-5 text-center text-white/70'>
            Sorry, service is not available right now.
          </p>
        ) : null}
      </div>

      {data ? (
        <div
          className={`site-page transition-opacity duration-700 ease-out ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {data.about ? (
            <AboutSection data={data.about} />
          ) : (
            <section id='about' className='scroll-mt-24 px-3 py-24'>
              About content unavailable.
            </section>
          )}

          {data.projects ? (
            <ProjectsGrid projects={data.projects} />
          ) : (
            <section id='projects' className='scroll-mt-24 bg-back px-3 py-24'>
              Projects unavailable.
            </section>
          )}

          {data.contacts && data.contacts.length > 0 ? (
            <ContactsSection
              data={data.contacts}
              resumeUrl={data.cv?.[0]?.cvFileUrl}
            />
          ) : (
            <section id='contacts' className='scroll-mt-24 bg-back px-3 py-24'>
              Contacts unavailable.
            </section>
          )}
        </div>
      ) : null}
    </>
  );
}
