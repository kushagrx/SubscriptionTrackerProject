import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import { sendEmail } from '../config/nodemailer.js';

const REMINDERS = [7, 3, 1];

export const sendReminders = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const subscription = await Subscription.findById(subscriptionId)
            .populate('user', 'email name');

        if (!subscription || subscription.status !== 'active') {
            console.log('Subscription not found or inactive:', subscriptionId);
            return res.status(200).json({ message: 'Subscription not found or inactive' });
        }

        const renewalDate = dayjs(subscription.renewalDate);
        const today = dayjs();
        const daysUntilRenewal = renewalDate.diff(today, 'day');

        if (REMINDERS.includes(daysUntilRenewal)) {
            const emailTemplate = `
                <h2>Subscription Renewal Reminder</h2>
                <p>Dear ${subscription.user.name},</p>
                <p>Your subscription <strong>${subscription.name}</strong> is due for renewal in ${daysUntilRenewal} days.</p>
                <h3>Subscription Details:</h3>
                <ul>
                    <li>Name: ${subscription.name}</li>
                    <li>Amount: ${subscription.currency} ${subscription.price}</li>
                    <li>Renewal Date: ${renewalDate.format('MMMM D, YYYY')}</li>
                    <li>Payment Method: ${subscription.paymentMethod}</li>
                </ul>
                <p>Please ensure your payment method is up to date to avoid any service interruption.</p>
                <p>Thank you for using our service!</p>
            `;

            await sendEmail({
                to: subscription.user.email,
                subject: `Renewal Reminder: ${subscription.name} (${daysUntilRenewal} days)`,
                html: emailTemplate
            });

            console.log(`Reminder email sent for subscription: ${subscriptionId}`);
        }

        res.status(200).json({
            success: true,
            message: 'Reminder check completed',
            daysUntilRenewal,
            nextReminder: REMINDERS.find(days => days < daysUntilRenewal) || 0
        });
    } catch (error) {
        console.error('Error processing reminders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};