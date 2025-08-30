import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5500';

async function testRateLimit() {
    console.log('🧪 Testing Rate Limiting...\n');
    
    // Test 15 requests rapidly
    for (let i = 1; i <= 15; i++) {
        try {
            console.log(`📤 Request ${i}:`);
            
            const response = await fetch(`${BASE_URL}/api/v1/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'User-Agent': 'PostmanRuntime/7.45.0',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: 'test@test.com', password: 'test' })
            });
            
            if (response.status === 429) {
                console.log(`   ❌ RATE LIMITED (${response.status})`);
                const retryAfter = response.headers.get('retry-after');
                if (retryAfter) {
                    console.log(`   ⏰ Retry after: ${retryAfter} seconds`);
                }
            } else if (response.ok) {
                console.log(`   ✅ SUCCESS (${response.status})`);
            } else {
                console.log(`   ⚠️  OTHER ERROR (${response.status})`);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
        }
    }
    
    console.log('\n🎯 Rate limiting test completed!');
    console.log('Expected: First 10 requests should succeed, then get rate limited');
}

// Check if server is running first
fetch(`${BASE_URL}/`)
    .then(() => {
        console.log('🚀 Server is running, starting rate limit test...\n');
        testRateLimit();
    })
    .catch(() => {
        console.log('❌ Server is not running. Please start your server first with:');
        console.log('   npm start\n');
    });
