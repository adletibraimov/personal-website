import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactPayload = {
  email?: string;
  message?: string;
};

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!email || !message) {
    return NextResponse.json(
      { error: 'Email and message are required.' },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: 'Message is too long.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const fromAddress = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !fromAddress) {
    return NextResponse.json(
      { error: 'Contact form is not configured yet.' },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `Contact <${fromAddress}>`,
      to: [to],
      replyTo: email,
      subject: `New message from ${email}`,
      text: `From: ${email}\n\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 502 }
    );
  }
}
