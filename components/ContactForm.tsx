'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      form.reset();
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <label className='sr-only' htmlFor='contact-email'>
        Your email
      </label>
      <input
        id='contact-email'
        name='email'
        type='email'
        required
        autoComplete='email'
        placeholder='Your email'
        disabled={status === 'loading'}
        className='w-full bg-[#ececf2] px-5 py-4 text-base text-primary placeholder:text-primary/40 outline-none transition disabled:opacity-60 focus:bg-secondary focus:text-white focus:placeholder:text-white'
      />

      <label className='sr-only' htmlFor='contact-message'>
        Message
      </label>
      <textarea
        id='contact-message'
        name='message'
        required
        rows={4}
        placeholder='Your message'
        disabled={status === 'loading'}
        className='w-full resize-none bg-[#ececf2] px-5 py-4 text-base text-primary placeholder:text-primary/40 outline-none transition focus:bg-secondary focus:text-white focus:placeholder:text-white disabled:opacity-60'
      />

      <button
        type='submit'
        disabled={status === 'loading'}
        className='self-start text-base font-medium text-primary transition hover:text-secondary disabled:opacity-60'
      >
        {status === 'loading' ? 'Sending…' : 'Send'}
      </button>

      {status === 'success' && (
        <p className='text-sm text-primary/70' role='status'>
          Message sent. I will get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className='text-sm text-third' role='alert'>
          {error}
        </p>
      )}
    </form>
  );
}
