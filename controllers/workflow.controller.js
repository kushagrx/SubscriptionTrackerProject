import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';

const REMINDERS = [7, 3, 1]; // days before renewal to send reminders

export const sendReminders = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const subscription = await Subscription.findById(subscriptionId).populate('user', 'email name');

        if (!subscription || subscription.status !== 'active') {
            return res.status(400).json({ message: 'Subscription not found or inactive' });
        }

        const renewalDate = dayjs(subscription.renewalDate);

        if (renewalDate.isBefore(dayjs())) {
            console.log(`Renewal date has passed for subscription: ${subscriptionId}`);
            return res.status(400).json({ message: 'Renewal date has passed' });
        }

        // Process reminders
        for (const daysBefore of REMINDERS) {
            const reminderDate = renewalDate.subtract(daysBefore, 'day');
            if (reminderDate.isAfter(dayjs())) {
                console.log(`Scheduled ${daysBefore}-day reminder for ${subscription._id}`);
                // Here you would implement your actual reminder logic
                // e.g., sending emails, notifications, etc.
            }
        }

        res.status(200).json({ message: 'Reminders scheduled successfully' });
    } catch (error) {
        console.error('Error processing reminders:', error);
        res.status(500).json({ message: 'Error processing reminders' });
    }
};