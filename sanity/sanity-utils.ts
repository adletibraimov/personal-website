import { groq } from 'next-sanity';
import { About } from '@/types/about';
import { client } from './lib/client';
import { CV } from '@/types/cv';
import { Project } from '@/types/project';
import { Contact, Contacts } from '@/types/contact';

export async function getAbout(): Promise<About> {
  return client.fetch(
    groq`*[_type == "about"][0]{
      name,
      image{
        alt,
        hotspot,
        crop,
        asset->{
          _type,
          _ref,
          url,
          metadata{
            lqip
          }
        }
      },
      subtitle,
      description
    } `,
    {},
    { cache: 'no-store' }
  );
}
export async function getCV(): Promise<CV[]> {
  return client.fetch(
    groq`*[_type=='cv']|order(orderRank){
      ...,
      "cvFileUrl": cvFile.asset->url,
      cvMobileImage{
        asset->{
          _type,
          _ref,
          url
        }
      }
    } `,
    {},
    { cache: 'no-store' }
  );
}

export async function getProjects(): Promise<Project[]> {
  return client.fetch(
    groq`*[_type=='projects']|order(orderRank){
      _id,
      name,
      image{
        asset->{
          _type,
          _ref,
          url,
          metadata{
            lqip
          }
        }
      },
      url
    } `,
    {},
    { cache: 'no-store' }
  );
}

export async function getContacts(): Promise<Contacts> {
  return client.fetch(
    groq`*[_type=='contacts'][0]{
      contacts
    } `,
    {},
    { cache: 'no-store' }
  );
}
