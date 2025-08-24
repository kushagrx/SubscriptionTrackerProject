import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req,res,next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()) return res.status(403).send({error:"Rate limit reached"});
            if(decision.reason.isBot()) return res.status(403).send({error:"Bot detected"});

            return res.status(403).send({error:"Access Denied"});
        }
        next();
    }
    catch(err) {
        console.log('Arcjet Middleware Error: ', err);
        next(err);
    }
}

export default arcjetMiddleware;