import express from 'express';
const app = express();
import {PORT, NODE_ENV} from './config/env.js';
import connectToMongoDB from "./Database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import subRouter from './routes/subscription.route.js';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(arcjetMiddleware);

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/subscriptions',subRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hey there from the API');
})
app.listen(PORT, () => {
    console.log(`API is running on port http://localhost:${PORT}`);
});
connectToMongoDB();