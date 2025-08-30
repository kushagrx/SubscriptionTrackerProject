import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        console.log(`Arcjet: Processing request to ${req.path} from ${req.get('User-Agent')}`);
        
        const decision = await aj.protect(req);
        
        console.log(`Arcjet: Decision - ${decision.isDenied() ? 'DENIED' : 'ALLOWED'}`);
        
        if (decision.isDenied()) {
            console.log(`Arcjet: Request denied - ${decision.reason}`);
            
            if (decision.reason.isRateLimit()) {
                console.log(`Arcjet: RATE LIMIT HIT - ${decision.reason}`);
                return res.status(429).json({
                    error: "Rate limit reached",
                    retryAfter: decision.reason.retryAfter,
                    message: "Too many requests, please try again later"
                });
            }

            return res.status(403).json({
                error: "Access Denied",
                reason: decision.reason
            });
        }
        
        console.log(`Arcjet: Request allowed`);
        next();
    }
    catch (error) {
        console.error(`Arcjet Middleware Error: ${error.message}`);
        if (process.env.NODE_ENV === 'development') {
            console.log('Arcjet: Allowing request through due to development mode');
            next();
        } else {
            next(error);
        }
    }
}

export default arcjetMiddleware;