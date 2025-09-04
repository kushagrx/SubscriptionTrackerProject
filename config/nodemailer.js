import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.js";

export const accountEmail = 'kushagrabisht10@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD,
    }
});

// Verify SMTP connection right after creating transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

export default transporter;