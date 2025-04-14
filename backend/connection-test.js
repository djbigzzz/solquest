// Import fetch with the correct syntax for Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// URLs to test
const frontendUrl = 'https://solquest.io';
const backendUrl = 'https://solquest-backend.vercel.app';
const backendApiUrl = `${backendUrl}/api`;
const rootEndpoint = `${backendUrl}/`;

async function testConnection(url, description) {
  try {
    console.log(`Testing ${description} at ${url}...`);
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    // Get response headers
    const headers = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });
    console.log('Headers:', headers);
    
    // Try to get the response as text first
    const textResponse = await response.text();
    console.log(`Raw response (first 200 chars): ${textResponse.substring(0, 200)}${textResponse.length > 200 ? '...' : ''}`);
    
    // Try to parse as JSON if possible
    let jsonData = null;
    try {
      jsonData = JSON.parse(textResponse);
      console.log(`✅ ${description} JSON response:`, jsonData);
    } catch (jsonError) {
      console.log(`Note: Response is not valid JSON`);
    }
    
    return { 
      success: response.ok, 
      status: response.status,
      headers,
      data: jsonData || textResponse
    };
  } catch (error) {
    console.error(`❌ Error connecting to ${description}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('=== SolQuest Connection Test ===');
  console.log('Testing connections between frontend, backend and database...');
  
  // Test backend root endpoint
  const rootResult = await testConnection(rootEndpoint, 'Backend root');
  
  // Continue testing other endpoints regardless of root endpoint result
  console.log('\nTesting API endpoints...');
  await testConnection(`${backendApiUrl}/leaderboard`, 'Leaderboard API');
  await testConnection(`${backendApiUrl}/auth/status`, 'Auth Status API');
  
  // Try frontend connection
  console.log('\nTesting frontend connection...');
  await testConnection(frontendUrl, 'Frontend');
  
  console.log('\n=== Connection Test Complete ===');
  
  // Provide summary
  console.log('\n=== Connection Test Summary ===');
  if (rootResult.success) {
    console.log('✅ Backend is accessible and responding correctly');
  } else {
    console.log('❌ Backend connection issues detected. Check deployment status on Vercel.');
  }
}

runTests();
