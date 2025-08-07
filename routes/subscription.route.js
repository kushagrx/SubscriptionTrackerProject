import {Router} from "express";
const subRouter = Router();

subRouter.get('/',(req,res)=>{
    res.send({title:"Get all the subscriptions"});
});
subRouter.get('/id',(req,res)=>{
    res.send({title:"Subscription details by id"});
});
subRouter.post('/',(req,res)=>{
    res.send({title:"Create a subscription"});
});
subRouter.put('/:id',(req,res)=>{
    res.send({title:"Update a subscription"});
});
subRouter.delete('/:id',(req,res)=>{
    res.send({title:"Delete a subscription"});
});
subRouter.get('/user/:id',(req,res)=>{
    res.send({title:"Get all user's subscriptions"});
});
subRouter.get('/:id/cancel',(req,res)=>{
    res.send({title:"Cancel a subscription"});
});
subRouter.get('/upcoming-renewal',(req,res)=>{
    res.send({title:"Get upcoming renewals"});
});


export default subRouter;