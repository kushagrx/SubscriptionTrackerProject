import cron from 'node-cron';
import Subscription from '../models/subscription.model.js';
import { processSubscriptionReminders } from '../controllers/workflow.controller.js';

// This job runs every single day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily subscription reminder check...');

    try {
        const subscriptions = await Subscription.find({ status: 'active' }).populate('user');

        for (const subscription of subscriptions) {
            if (subscription.user?.email) {
                await processSubscriptionReminders(subscription);
            }
        }
    } catch (error) {
        console.error('Error in daily subscription cron job:', error);
    }
});