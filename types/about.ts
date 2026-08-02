import { Image } from './image';

export type AboutBeat = {
  _key: string;
  title: string;
  description: string;
};

export type About = {
  _id: string;
  _createdAt: Date;
  image: Image;
  catchphrase: string;
  beats: AboutBeat[];
};
