'use client';

import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatIcon from '@mui/icons-material/Chat';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Button from '@/components/Button';
import type { Contacts } from '@/types/contact';

const iconMapper: Record<string, React.ElementType> = {
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  email: EmailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  custom: ChatIcon,
  phone: LocalPhoneIcon,
};

export default function ContactsSection({ data }: { data: Contacts }) {
  return (
    <section
      id='contacts'
      className='scroll-mt-24 px-3 flex flex-col gap-4 py-24 min-h-screen pb-32'
    >
      <div>
        <h2 className='font-bold mb-2 pb-3 text-5xl md:text-7xl'>CONTACTS</h2>
      </div>
      {data.contacts.map((item, key) => {
        const IconComponent = item?.socialMedia
          ? iconMapper[item.socialMedia] || iconMapper.custom
          : iconMapper.custom;

        return (
          <Button
            key={key}
            icon={IconComponent}
            text={item.name}
            value={item.link}
          />
        );
      })}
    </section>
  );
}
