'use client';

import ContactForm from '@/components/ContactForm';
import config from '@/lib/config';
import type { Contact } from '@/types/contact';

function formatLinkLabel(value: string) {
  return value.replace(/^https?:\/\//, '').replace(/^mailto:/, '');
}

export default function ContactsSection({ data }: { data: Contact[] }) {
  const socials = data.filter(
    (item) => item.socialMedia !== 'email' && item.socialMedia !== 'phone'
  );
  const emails = data.filter((item) => item.socialMedia === 'email');
  const phones = data.filter((item) => item.socialMedia === 'phone');
  const year = new Date().getFullYear();

  return (
    <section
      id='contacts'
      className='scroll-mt-24 flex min-h-[70vh] flex-col justify-between bg-back px-5 py-24 md:px-8 md:py-28'
    >
      <div className='grid gap-14 md:grid-cols-12 md:gap-10 lg:gap-16'>
        <div className='md:col-span-3'>
          <p className='text-base leading-relaxed text-primary md:text-lg'>
            Based in {config.location.city}, {config.location.country}
          </p>
          <p className='text-base leading-relaxed text-primary md:text-lg'>
            Originally from Almaty, Kazakhstan
          </p>
        </div>

        <div className='flex flex-col gap-10 md:col-span-4'>
          {socials.length > 0 && (
            <ul className='flex flex-col gap-2'>
              {socials.map((item) => (
                <li key={item._id}>
                  <a
                    href={item.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-base text-primary transition-colors hover:text-secondary md:text-lg'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className='flex flex-col gap-6'>
            {emails.map((item) => (
              <div key={item._id}>
                <p className='mb-1 text-sm text-primary/55'>Email</p>
                <a
                  href={
                    item.link.startsWith('mailto:')
                      ? item.link
                      : `mailto:${item.link}`
                  }
                  className='text-base text-primary transition-colors hover:text-secondary md:text-lg'
                >
                  {formatLinkLabel(item.link)}
                </a>
              </div>
            ))}

            {phones.map((item) => (
              <div key={item._id}>
                <p className='mb-1 text-sm text-primary/55'>Phone</p>
                <a
                  href={item.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-base text-primary transition-colors hover:text-secondary md:text-lg'
                >
                  {item.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className='md:col-span-5'>
          <h2 className='mb-6 text-3xl font-bold leading-tight text-primary md:text-4xl lg:text-5xl'>
            Get in touch
          </h2>
          <ContactForm />
        </div>
      </div>

      <div className='mt-20 flex flex-col gap-3 border-t border-primary/10 pt-6 text-sm text-primary/55 md:mt-28 md:flex-row md:items-center md:justify-between'>
        <p>
          ©{year} {config.author}
        </p>
        <p>Built by {config.author}</p>
      </div>
    </section>
  );
}
