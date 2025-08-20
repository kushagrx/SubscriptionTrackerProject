import {Router} from "express";
const userRouter  = Router();
import {getUsers} from "../controllers/user.controller.js";
import {getUser} from "../controllers/user.controller.js";

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);

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