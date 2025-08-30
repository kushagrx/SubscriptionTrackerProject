import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        console.log(`Arcjet: Processing request to ${req.path} from ${req.get('User-Agent')}`);
        
        // Create a clean request object for Arcjet
        const arcjetRequest = {
            ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1',
            method: req.method,
            path: req.path,
            headers: {
                'user-agent': req.get('User-Agent') || '',
                'host': req.get('Host') || '',
                'content-type': req.get('Content-Type') || '',
                'authorization': req.get('Authorization') || '',
            },
            body: req.body,
            query: req.query,
        };
        
        console.log(`Arcjet: Request details - IP: ${arcjetRequest.ip}, Method: ${arcjetRequest.method}`);
        
        const decision = await aj.protect(arcjetRequest);
        
        console.log(`Arcjet: Decision - ${decision.isDenied() ? 'DENIED' : 'ALLOWED'}`);
        
        if (decision.isDenied()) {
            console.log(`🚫 Arcjet: Request denied - ${decision.reason}`);
            
            if (decision.reason && typeof decision.reason === 'object' && decision.reason.isRateLimit && decision.reason.isRateLimit()) {
                console.log(`🚫 Arcjet: RATE LIMIT HIT - ${decision.reason}`);
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
        
        console.log(`✅ Arcjet: Request allowed`);
        next();
    }
    catch (error) {
        console.error(`❌ Arcjet Middleware Error: ${error.message}`);
        console.error(`❌ Error stack: ${error.stack}`);
        // Let the error propagate instead of allowing requests through
        next(error);
    }
}

export default arcjetMiddleware;