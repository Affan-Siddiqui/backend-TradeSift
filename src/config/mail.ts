// config/mail.ts
import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
  await transporter.sendMail({
    from: env.GMAIL_USER,
    to,
    subject,
    html,
  });
};