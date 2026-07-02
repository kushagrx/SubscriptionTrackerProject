import Subscription from '../models/subscription.model.js'
import { generateSubscriptionInsights } from '../services/ai.service.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'
import { sendReminderEmail } from '../utils/send-email.js'
import dayjs from 'dayjs'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        await subscription.populate('user', 'email name');

        await sendReminderEmail({
            to: subscription.user.email,
            type: "7 days before reminder", 
            subscription: {
                user: {
                    name: subscription.user.name,
                    email: subscription.user.email
                },
                name: subscription.name,
                renewalDate: subscription.renewalDate,
                price: subscription.price,
                currency: subscription.currency,
                frequency: subscription.frequency,
                paymentMethod: subscription.paymentMethod
            }
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ 
            success: true, 
            data: { subscription, workflowRunId },
            message: 'Subscription created and welcome email sent'
        });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}

export const getAIInsights = async (req, res) => {
    try {
        // req.user.id comes from your existing JWT auth middleware
        const userId = req.user._id || req.user.id; 
        const userName = req.user.name || 'User';

        // Fetch all active subscriptions belonging to this user
        const subscriptions = await Subscription.find({ user: userId, status: 'active' });

        // Pass them to our AI service
        const insight = await generateSubscriptionInsights(subscriptions, userName);

        return res.status(200).json({
            success: true,
            insight
        });
    } catch (error) {
        console.error('Error in getAIInsights controller:', error);
        return res.status(500).json({ success: false, message: 'Server error generating AI insights' });
    }
};