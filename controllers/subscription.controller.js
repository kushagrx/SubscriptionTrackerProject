import workflowClient from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        // Start the workflow to send reminders
        const {workflowrunId}= await workflowClient.trigger({url,body,headers,workflowrunId,retries}={
            url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
            },
            headers: {
                'Content-Type': 'application/json',     // Set content type to JSON 
            },
            retries: 0,                       // No retries on failure
        });
        res.status(201).json({success: true, data: subscription});
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