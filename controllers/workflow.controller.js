import dayjs from "dayjs";
import { createRequire } from 'module';
import Subscription from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7,3,1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return {status: "inactive or missing"};

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscription.id}. Stopping the workflow`);
        return {status: "expired"};
    }

    for (const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore,'day');
        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context,`Reminder ${daysBefore} days before`, reminderDate);
            await triggerReminder(context, `Reminder ${daysBefore} days before`);
        }
        // If reminder date already passed, it will just skip this iteration
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    const subscriptionData = await Subscription.findById(subscriptionId)
        .populate('user', 'email')
        .lean();

    return await context.run('get subscription', () => {
        return subscriptionData;
    });
}

const sleepUntilReminder = async(context,label,date) => {
    console.log(`Sleeping until ${label} due date \n Next reminder at ${date}`);
    await context.sleepUntil(label,date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label,()=>{
        console.log(`Triggering ${label} reminder`);
        // Add actual reminder logic here (e.g. send email)
    });
}