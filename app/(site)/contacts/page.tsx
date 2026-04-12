import React from 'react';
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import Button from '../../../components/Button';
import ChatIcon from '@mui/icons-material/Chat';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { getContacts } from '@/sanity/sanity-utils';
import { Metadata } from 'next';
import { Suspense } from 'react';

const siteUrl = 'https://adletibraimov.cv';

export const metadata: Metadata = {
  title: 'Contacts | Adlet Ibraimov',
  description:
    'Get in touch with Adlet Ibraimov - Frontend & Shopify Developer based in Milan, Italy. Available for freelance projects and collaborations.',
  keywords: ['contact adlet ibraimov', 'frontend developer contact', 'shopify developer milan', 'web developer contact'],
  openGraph: {
    title: 'Contacts | Adlet Ibraimov',
    description: 'Get in touch with Adlet Ibraimov - Frontend & Shopify Developer based in Milan, Italy.',
    url: `${siteUrl}/contacts`,
  },
};

type IconMapper = {
  [key: string]: React.ElementType;
};
const iconMapper: IconMapper = {
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  email: EmailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  custom: ChatIcon,
  phone: LocalPhoneIcon,
};

async function ContactsContent() {
  const data = await getContacts();

  if (!data) return <div>No contacts founded</div>;

  return (
    <div className='px-3 flex flex-col gap-4 py-24'>
      <div>
        <h1 className='font-bold mb-2 pb-3'>CONTACTS</h1>
      </div>
      {data?.contacts.map((item, key) => {
        const IconComponent = item?.socialMedia
          ? iconMapper[item?.socialMedia]
          : iconMapper['custom'];

        return (
          <Button
            key={key}
            icon={IconComponent}
            text={item.name}
            value={item.link}
          />
        );
      })}
    </div>
  );
}

export default function Contacts() {
  return (
    <Suspense fallback={<div className='px-3 py-24'>Loading contacts...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
