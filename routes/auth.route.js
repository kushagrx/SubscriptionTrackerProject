import {Router} from "express";
const authRouter = Router();

authRouter.post("/sign-up", (req, res) => {
    res.send("Welcome to the sign up page");
});
authRouter.post("/sign-in", (req, res) => {
    res.send("It's great to have you back!");
});
authRouter.post("/sign-out", (req, res) => {
    res.send({title:"Sign Out"});
});

export default authRouter;