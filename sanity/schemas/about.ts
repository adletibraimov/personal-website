import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About me',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Portrait',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'catchphrase',
      title: 'Catchphrase',
      type: 'string',
      description: 'Appears after the portrait on scroll',
      initialValue: 'Yep, this is me!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beats',
      title: 'Scroll beats',
      type: 'array',
      description: 'Text blocks revealed one by one while scrolling',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'beat',
          title: 'Beat',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'catchphrase',
      media: 'image',
    },
  },
});
