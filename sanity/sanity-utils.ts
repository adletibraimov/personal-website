import { groq } from 'next-sanity';
import { About } from '@/types/about';
import { client } from './lib/client';
import { CV } from '@/types/cv';
import { Project } from '@/types/project';
import { Contact } from '@/types/contact';

export async function getAbout(): Promise<About> {
  return client.fetch(
    groq`*[_type == "about"][0]{
      _id,
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
      catchphrase,
      beats[]{
        _key,
        title,
        description
      }
    }`,
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

export async function getContacts(): Promise<Contact[]> {
  return client.fetch(
    groq`*[_type=='contact']|order(orderRank){
      _id,
      name,
      link,
      socialMedia
    }`,
    {},
    { cache: 'no-store' }
  );
}
