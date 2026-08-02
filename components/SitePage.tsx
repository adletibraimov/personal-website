'use client';

import { useEffect, useState } from 'react';
import {
  getAbout,
  getContacts,
  getCV,
  getProjects,
} from '@/sanity/sanity-utils';
import type { About } from '@/types/about';
import type { CV } from '@/types/cv';
import type { Project } from '@/types/project';
import type { Contacts } from '@/types/contact';
import AboutSection from '@/components/sections/AboutSection';
import CvSection from '@/components/sections/CvSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

type SiteData = {
  about: About | null;
  cv: CV[] | null;
  projects: Project[] | null;
  contacts: Contacts | null;
};

function scrollToHash() {
  const id = window.location.hash.replace('#', '');
  if (!id) return;
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  });
}

export default function SitePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState(false);

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
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [data]);

  if (error) {
    return (
      <div className='px-3 py-24'>Sorry, service is not available right now.</div>
    );
  }

  if (!data) {
    return <div className='px-3 py-24'>Loading...</div>;
  }

  return (
    <div className='site-page'>
      {data.about ? (
        <AboutSection data={data.about} />
      ) : (
        <section id='about' className='scroll-mt-24 px-3 py-24'>
          About content unavailable.
        </section>
      )}

      {data.cv ? (
        <CvSection data={data.cv} />
      ) : (
        <section id='cv' className='scroll-mt-24 px-3 py-24'>
          CV unavailable.
        </section>
      )}

      {data.projects ? (
        <ProjectsGrid projects={data.projects} />
      ) : (
        <section id='projects' className='scroll-mt-24 px-3 py-24'>
          Projects unavailable.
        </section>
      )}

      {data.contacts ? (
        <ContactsSection data={data.contacts} />
      ) : (
        <section id='contacts' className='scroll-mt-24 px-3 py-24'>
          Contacts unavailable.
        </section>
      )}
    </div>
  );
}
