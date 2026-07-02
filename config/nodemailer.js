import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

const accountEmail = process.env.EMAIL_USER || 'subtracker@example.com';

const transporter = nodemailer.createTransport(
    process.env.EMAIL_HOST
        ? {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT || 587),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        }
        : {
            jsonTransport: true,
        }
);

export { accountEmail };
export default transporter;
