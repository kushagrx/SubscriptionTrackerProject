import {workflowClient} from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        // Trigger the Upstash workflow for reminders
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        res.status(201).json({
            success: true,
            data: subscription,
            workflowRunId // Returns Upstash workflow run ID for tracking
        });
    }
    catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Ensure only the user can access their subscriptions
        if(req.params.id !== req.user.id){
            const error = new Error("You are not the owner of this account");
            error.status = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    }
    catch (error) {
        next(error);
    }
};