import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1]; 

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
            const emailType = `${daysUntilRenewal} days before reminder`;
            
            await sendReminderEmail({
                to: subscription.user.email,
                type: emailType,
                subscription: subscription
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