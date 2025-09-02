import {Router} from "express";

const workflowRouter = Router();

workflowRouter.get("/", (req, res) => {
    res.send("Workflow route is working!");
});

export default workflowRouter;