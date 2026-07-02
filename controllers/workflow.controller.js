import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];

export const processSubscriptionReminders = async (subscription) => {
    if (!subscription || subscription.status !== 'active') {
        console.log('Subscription not found or inactive:', subscription?._id || subscription?.id);
        return { skipped: true, reason: 'Subscription not found or inactive' };
    }

    const renewalDate = dayjs(subscription.renewalDate);
    const today = dayjs();
    const daysUntilRenewal = renewalDate.diff(today, 'day');

    if (REMINDERS.includes(daysUntilRenewal)) {
        const emailType = `${daysUntilRenewal} days before reminder`;

        await sendReminderEmail({
            to: subscription.user.email,
            type: emailType,
            subscription
        });

        console.log(`Reminder email sent for subscription: ${subscription._id}`);
    }

    return {
        success: true,
        daysUntilRenewal,
        nextReminder: REMINDERS.find(days => days < daysUntilRenewal) || 0
    };
};

export const sendReminders = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const subscription = await Subscription.findById(subscriptionId)
            .populate('user', 'email name');

        const result = await processSubscriptionReminders(subscription);

        res.status(200).json({
            success: true,
            message: 'Reminder check completed',
            ...result
        });
    } catch (error) {
        console.error('Error processing reminders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};