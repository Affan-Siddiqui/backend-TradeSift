// config/mail.ts
import nodemailer from 'nodemailer';
import { env } from './env.js';
import logger from './logger.js';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD,
    },
});
export const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: env.GMAIL_USER,
        to,
        subject,
        html,
    });
};
//# sourceMappingURL=mail.js.map