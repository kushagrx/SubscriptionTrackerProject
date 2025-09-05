import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kushagrabisht10@gmail.com', 
        pass: EMAIL_PASSWORD
    }
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: 'kushagrabisht10@gmail.com', 
            to,
            subject,
            html
        });
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};