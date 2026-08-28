import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  if (env.RESEND_API_KEY) {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
    if (error) throw new Error(`Resend error: ${error.message}`);
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    const transport = nodemailer.createTransport({ host: 'localhost', port: 1025, secure: false });
    await transport.sendMail({ from: env.EMAIL_FROM, to, subject, html });
    return;
  }

  throw new Error('RESEND_API_KEY is not set and NODE_ENV is not development');
}
