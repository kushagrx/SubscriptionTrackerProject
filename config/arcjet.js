import arcjet, { tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "./env.js";

console.log('🔧 Arcjet Configuration:');
console.log(`   Environment: ${NODE_ENV}`);
console.log(`   Arcjet Key: ${ARCJET_KEY ? 'Present' : 'Missing'}`);

const aj = arcjet({
    key: ARCJET_KEY,
    rules: [
        tokenBucket({
            mode: "LIVE",
            refillRate: 2, // 2 requests
            interval: 10,  // per 10 seconds
            capacity: 3,   // with max 3 requests burst
        }),
    ],
});

console.log('✅ Arcjet configured with LIVE rate limiting');
console.log('   Rate limit: 2 requests per 10 seconds, max 3 burst');

export default aj;