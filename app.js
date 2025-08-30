import express from 'express';
const app = express();
import {PORT, NODE_ENV} from './config/env.js';
import connectToMongoDB from "./Database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
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

// Hybrid approach: express-rate-limit for reliable rate limiting + Arcjet for monitoring
app.use('/api', apiLimiter); // Reliable rate limiting
app.use('/api', arcjetMiddleware); // Arcjet monitoring (even if rate limiting fails)

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/subscriptions',subRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`API is running on port http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log('✅ Hybrid: express-rate-limit (working) + Arcjet (monitoring)');
});
connectToMongoDB();