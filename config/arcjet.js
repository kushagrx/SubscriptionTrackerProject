import arcjet, { tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "./env.js";

console.log('🔧 Arcjet Configuration:');
console.log(`   Environment: ${NODE_ENV}`);
console.log(`   Arcjet Key: ${ARCJET_KEY ? 'Present' : 'Missing'}`);

// Create Arcjet instance with explicit environment
const aj = arcjet({
    key: ARCJET_KEY,
    environment: NODE_ENV,
    rules: [
        tokenBucket({
            mode: "LIVE",
            refillRate: 1, // 1 request
            interval: 5,   // per 5 seconds
            capacity: 2,   // with max 2 requests burst
        }),
    ],
});

console.log('✅ Arcjet configured with LIVE rate limiting only');
console.log('   Rate limit: 1 request per 5 seconds, max 2 burst');

export default aj;