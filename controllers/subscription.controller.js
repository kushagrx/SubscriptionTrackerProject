import workflowClient from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        
        // Start the workflow to send reminders using publishJSON
        const messageId = await workflowClient.publishJSON({
            url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
            },
        });

        res.status(201).json({ 
            success: true, 
            data: subscription,
            messageId
        });
    }
    catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        //Checks if the user is the same as the one in the token
        if(req.params.id !== req.user.id){
            const error=new Error("You are not the owner of this account");
            error.status=401;
            throw error;
        }
        const subscriptions = await Subscription.find({user: req.params.id});
        res.status(200).json({success: true, data: subscriptions});
    }
    catch (error) {
        next(error);
    }
}