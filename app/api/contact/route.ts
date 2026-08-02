import { NextResponse } from 'next/server';

type ContactPayload = {
  email?: string;
  message?: string;
};

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

  // Wire up Resend here when ready:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from, to, replyTo: email, subject, text: message });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Contact form is not configured yet.' },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: 'Resend integration is not connected yet.' },
    { status: 501 }
  );
}
