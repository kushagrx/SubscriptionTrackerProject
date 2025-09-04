import dayjs from "dayjs";
import { createRequire } from 'module';
import Subscription from "../models/subscription.model.js";
import {sendReminderEmail} from "../utils/send-email.js";
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 3, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return {status: "inactive or missing"};

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscription._id}. Stopping the workflow`);
        return {status: "expired"};
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        const label = `${daysBefore} days before reminder`;

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, label, reminderDate);
            await triggerReminder(context, label, subscription);
        }
        // If reminder date already passed, it will just skip this iteration
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    const subscriptionData = await Subscription.findById(subscriptionId)
        .populate('user', 'name email') // Ensure name is populated for userName
        .lean();

    if (subscriptionData && subscriptionData.user) {
        subscriptionData.userName = subscriptionData.user.name || 'User';
    }

    return await context.run('get subscription', () => {
        return subscriptionData;
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} due date \n Next reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        });
    });
}