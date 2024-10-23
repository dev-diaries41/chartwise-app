import nodemailer, { Transporter } from 'nodemailer';
import { Time } from '@/app/constants/global';

const createEmailTransporter = (): Transporter => nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // true for SSL (465)
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    },
    connectionTimeout: 10 * Time.sec,
});

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
    const transporter = createEmailTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    });
}
