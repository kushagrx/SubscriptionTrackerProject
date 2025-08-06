import {Router} from "express";
const userRouter  = Router();

userRouter.get('/', (req, res) => {
    res.send({title:"Fetch all users"});
});
userRouter.get('/:id', (req, res) => {
    res.send({title:"Get details of a user"});
});
userRouter.post('/', (req, res) => {
    res.send({title:"Create new user"});
});
userRouter.put('/:id', (req, res) => {
    res.send({title:"Update user by id"});
});
userRouter.delete('/:id', (req, res) => {
    res.send({title:"Delete this user"});
});

export default userRouter;