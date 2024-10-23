import nodemailer, { Transporter } from 'nodemailer';
import { Time } from '../constants/global';

export const emailTransporter: Transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // set to true if using SSL (port 465)
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    },
    connectionTimeout: 10*Time.sec,
});
