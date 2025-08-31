import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 5,
    message: {
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
        retryAfter: '10 seconds'
    },
    standardHeaders: true,
    legacyHeaders: false, 
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