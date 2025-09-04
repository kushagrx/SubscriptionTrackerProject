import dayjs from "dayjs";
import { createRequire } from 'module';
import Subscription from "../models/subscription.model.js";
import {sendReminderEmail} from "../utils/send-email.js";
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 3, 2, 1];

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
            // Future reminder - sleep until that date
            await sleepUntilReminder(context, label, reminderDate);
            await triggerReminder(context, label, subscription);
        } else if (dayjs().isSame(reminderDate, 'day')) {
            // If it's exactly today, trigger reminder immediately
            await triggerReminder(context, label, subscription);
        } else {
            // Past reminder date; do nothing or optionally log skipping
            console.log(`Skipping reminder for ${label} as date has passed`);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    const subscriptionData = await Subscription.findById(subscriptionId)
        .populate('user', 'name email')
        .lean();

    if (!subscriptionData) {
        throw new Error(`Subscription not found: ${subscriptionId}`);
    }

    if (subscriptionData.user) {
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
        console.log(`About to send reminder email. Label: ${label}, Email: ${subscription.user?.email || "No email found"}`);

        if (!subscription.user?.email) {
            console.error("Missing user email. Skipping email send.");
            return;
        }
        try {
            await sendReminderEmail({
                to: subscription.user.email,
                type: label,
                subscription,
            });
            console.log(`Email sent successfully for ${label} reminder`);
        } catch (error) {
            console.error(`Error sending email for ${label}:`, error);
        }
    });
};