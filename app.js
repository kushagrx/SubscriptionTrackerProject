// File: app.js

import express from 'express';
const app = express();
import {PORT, NODE_ENV} from './config/env.js';
import connectToMongoDB from "./Database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import apiLimiter from "./middlewares/rate-limit.middleware.js";

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import subRouter from './routes/subscription.route.js';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint - no rate limiting
app.get('/', (req, res) => {
    res.send('Hey there from the API');
})

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/subscriptions',subRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`API is running on port http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log('✅ Rate limiting: 5 requests per 10 seconds');
});
connectToMongoDB();