import rateLimit from 'express-rate-limit';

// Create a rate limiter
const apiLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
        retryAfter: '10 seconds'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        console.log(`🚫 Rate limit exceeded for ${req.ip}`);
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many requests, please try again later',
            retryAfter: '10 seconds'
        });
    }
});

export default apiLimiter;
