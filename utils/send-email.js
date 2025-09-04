import {emailTemplates} from "./email-template.js";
import transporter, {accountEmail} from "../config/nodemailer.js";
import dayjs from "dayjs";

export const sendReminderEmail = async ({to, type, subscription}) => {
    console.log(`Preparing to send reminder email of type '${type}' to ${to}`);
    if (!to || !type) throw new Error('Reminder email info is required');
    const template = emailTemplates.find((t) => t.label === type);
    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.userName,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('DD-MM-YYYY'),
        planName: subscription.name,
        price: `${subscription.price}`,
        paymentMethod: subscription.paymentMethod,
    };

    const message = template.generateBody(mailInfo);
    const subject = typeof template.generateSubject === "function"
        ? template.generateSubject(mailInfo)
        : template.subject || "Subscription Reminder";

    const mailOptions = {
        from: accountEmail,
        to,
        subject,
        html: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error in sending email:', error);
        throw error;
    }
};