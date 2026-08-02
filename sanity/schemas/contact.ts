import { defineType, defineField } from 'sanity';
import {
  orderRankField,
  orderRankOrdering,
} from '@sanity/orderable-document-list';

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'socialMedia',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'X / Twitter', value: 'x' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Email', value: 'email' },
          { title: 'Linkedin', value: 'linkedin' },
          { title: 'GitHub', value: 'github' },
          { title: 'Phone', value: 'phone' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    orderRankField({ type: 'contact' }),
  ],
  orderings: [orderRankOrdering as any],
  preview: {
    select: {
      title: 'name',
      subtitle: 'socialMedia',
    },
  },
});
