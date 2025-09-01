import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription,getUserSubscriptions} from "../controllers/subscription.controller.js";

const subRouter = Router();

subRouter.get('/',(req,res)=>{
    res.send({title:"Get all the subscriptions"});
});
subRouter.get('/:id',(req,res)=>{
    res.send({title:"Subscription details by id"});
});
subRouter.post('/',authorize,createSubscription);

subRouter.put('/:id',(req,res)=>{
    res.send({title:"Update a subscription"});
});
subRouter.delete('/:id',(req,res)=>{
    res.send({title:"Delete a subscription"});
});
subRouter.get('/user/:id', authorize, getUserSubscriptions);

subRouter.get('/:id/cancel',(req,res)=>{
    res.send({title:"Cancel a subscription"});
});
subRouter.get('/upcoming-renewal',(req,res)=>{
    res.send({title:"Get upcoming renewals"});
});

export default subRouter;