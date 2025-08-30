import http from 'http';

const BASE_URL = 'http://localhost:5500';

function makeRequest(requestNumber) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email: `test${requestNumber}@example.com`,
            password: 'testpassword123'
        });

        const options = {
            hostname: 'localhost',
            port: 5500,
            path: '/api/v1/auth/sign-in',
            method: 'POST',
            headers: {
                'User-Agent': 'PostmanRuntime/7.45.0',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function testRateLimit() {
    console.log('🧪 Testing Rate Limiting (Simple Test)...\n');
    
    // Test 10 requests rapidly
    for (let i = 1; i <= 10; i++) {
        try {
            console.log(`📤 Request ${i}:`);
            
            const result = await makeRequest(i);
            
            if (result.status === 429) {
                console.log(`   ❌ RATE LIMITED (${result.status})`);
                console.log(`   Response: ${result.data}`);
            } else if (result.status === 200 || result.status === 201) {
                console.log(`   ✅ SUCCESS (${result.status})`);
            } else {
                console.log(`   ⚠️  OTHER STATUS (${result.status})`);
                console.log(`   Response: ${result.data}`);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
        }
    }
    
    console.log('\n🎯 Rate limiting test completed!');
    console.log('Expected: First 3 requests should succeed, then get rate limited');
}

// Check if server is running first
makeRequest(0)
    .then(() => {
        console.log('🚀 Server is running, starting rate limit test...\n');
        testRateLimit();
    })
    .catch(() => {
        console.log('❌ Server is not running. Please start your server first with:');
        console.log('   npm start\n');
    });
