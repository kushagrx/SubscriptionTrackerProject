import {Router} from "express";
const userRouter  = Router();

import {getUsers} from "../controllers/user.controller.js";
import {getUser} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import {deleteUser} from "../controllers/user.controller.js";

userRouter.get('/', getUsers);
userRouter.get('/:id', authorize, errorMiddleware, getUser);  // You can chain as many middlewares as you want

userRouter.post('/', (req, res) => {
    res.send({title:"Create new user"});
});
userRouter.put('/:id', (req, res) => {
    res.send({title:"Update user by id"});
});
userRouter.delete('/:id', authorize, errorMiddleware, deleteUser); 

export default userRouter;