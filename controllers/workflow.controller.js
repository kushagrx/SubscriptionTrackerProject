import dayjs from 'dayjs';
import {createRequire} from 'module';
import Subscription from '../models/subscription.model';
const require = createRequire(import.meta.url);
/* We have set type to module in package.json, so we need to use createRequire 
to import commonjs modules*/
const {serve} = require('@upstash/workflow/express');

const REMINDERS = [7, 3, 1]; // days before renewal to send reminders

export const sendReminders = serve(async (context)=>{
    const {subscriptionId} = context.requestPayload;
    // Logic to send reminder (e.g., email, SMS) for the subscriptionId
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return; 
    //kill the workflow if subscription is not active

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription: ${subscriptionId}.Stopping workflow.`);
        return; // Stop the workflow if renewal date has passed
    }

    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `${daysBefore}-day`, reminderDate);
        }
        await triggerReminder(context, `${daysBefore}-day`); // Send the reminder
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', ()=>{
        return Subscription.findById(subscriptionId).populate('user', 'email name');
    });
    // Using context.run to ensure database operations are retried if the workflow is resumed
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder date: ${date}`);
    await context.sleepUntil(date.toDate());
}

const triggerReminder = async (context,label) => {
    return await context.run(label,()=>{
        console.log(`Triggering ${label} reminder for subscription.`);
    })
}