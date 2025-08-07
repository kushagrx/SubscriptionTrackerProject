import express from 'express';
const app = express();
import {PORT, NODE_ENV} from './config/env.js';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import subRouter from './routes/subscription.route.js';

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/subscriptions',subRouter);

app.get('/', (req, res) => {
    res.send('Hey there from the API');
})
app.listen(PORT, () => {
    console.log(`API is running on port http://localhost:${PORT}`);
});