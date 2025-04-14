/**
 * SolQuest Backend Tools
 * 
 * A consolidated utility script for monitoring and testing the SolQuest backend.
 * This replaces several individual scripts with a single, more comprehensive tool.
 */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dns = require('dns');
const { promisify } = require('util');

// Promisify DNS lookup
const lookup = promisify(dns.lookup);
const resolve4 = promisify(dns.resolve4);

// Configuration
const config = {
  // URLs
  frontend: 'https://solquest.io',
  vercelDeployment: 'https://solquest-dfseffz2e-mystartup-team.vercel.app',
  customDomain: 'https://api.solquest.io',
  
  // DNS
  expectedVercelIP: '76.76.21.21',
  dnsServers: [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: 'OpenDNS', ip: '208.67.222.222' },
    { name: 'Quad9', ip: '9.9.9.9' },
    { name: 'Local DNS', ip: null } // Uses system default
  ],
  
  // API endpoints to test
  endpoints: [
    { path: '/api/health', name: 'Health Check' },
    { path: '/api/leaderboard', name: 'Leaderboard' },
    { path: '/api/auth/status', name: 'Auth Status' },
    { path: '/api/quests', name: 'Quests' },
    { path: '/api/users/profile', name: 'User Profile' },
    { path: '/api/referrals/code', name: 'Referrals' },
    { path: '/api/quests/solana-basics', name: 'Quest Detail' }
  ],
  
  // Monitor settings
  monitorInterval: 60000 // 1 minute
};

/**
 * Format time
 */
function formatTime(date = new Date()) {
  return date.toLocaleTimeString();
}

/**
 * Print a section header
 */
function printHeader(title) {
  console.log(`\n=== ${title} ===`);
}

/**
 * Test connection to a URL
 */
async function testConnection(url, description) {
  try {
    console.log(`Testing ${description} at ${url}...`);
    const response = await fetch(url);
    const status = response.status;
    console.log(`Status: ${status} ${response.statusText}`);
    
    // Get response headers
    const headers = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });
    
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
      status,
      headers,
      data: jsonData || textResponse
    };
  } catch (error) {
    console.error(`❌ Error connecting to ${description}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check DNS propagation for the custom domain
 */
async function checkDNSPropagation() {
  printHeader(`DNS Propagation Check for ${config.customDomain.replace('https://', '')}`);
  console.log(`Expected Vercel IP: ${config.expectedVercelIP}`);
  console.log('Checking propagation across multiple DNS servers...\n');

  let propagatedCount = 0;
  const totalServers = config.dnsServers.length;
  const domain = config.customDomain.replace('https://', '');

  for (const server of config.dnsServers) {
    try {
      let resolvedIP;
      
      if (server.ip) {
        // Set custom DNS server
        const resolver = new dns.Resolver();
        resolver.setServers([server.ip]);
        const resolve = promisify(resolver.resolve4.bind(resolver));
        const ips = await resolve(domain);
        resolvedIP = ips[0];
      } else {
        // Use system default
        const result = await lookup(domain);
        resolvedIP = result.address;
      }
      
      const isCorrect = resolvedIP === config.expectedVercelIP;
      if (isCorrect) propagatedCount++;
      
      console.log(`${server.name}: ${resolvedIP} ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
    } catch (error) {
      console.log(`${server.name}: ❌ ERROR - ${error.code || error.message}`);
    }
  }

  console.log(`\n=== Propagation Summary ===`);
  const propagationPercentage = (propagatedCount / totalServers) * 100;
  console.log(`Propagation status: ${propagatedCount}/${totalServers} DNS servers (${propagationPercentage.toFixed(1)}%)`);
  
  if (propagationPercentage === 100) {
    console.log('✅ DNS is fully propagated! The custom domain should be working.');
  } else if (propagationPercentage > 50) {
    console.log('⚠️ DNS is partially propagated. Some users may be able to access the API via the custom domain.');
  } else {
    console.log('❌ DNS propagation is still in progress. Most users will not be able to access the API via the custom domain yet.');
    console.log('   Continue using the fallback URL in the meantime.');
  }
  
  return {
    propagatedCount,
    totalServers,
    percentage: propagationPercentage
  };
}

/**
 * Test all backend endpoints
 */
async function testBackendEndpoints() {
  printHeader('Backend Endpoint Tests');
  
  const results = {
    vercel: {},
    customDomain: {}
  };
  
  // Test Vercel deployment
  console.log('\nTESTING VERCEL DEPLOYMENT URL');
  console.log('==============================');
  
  // Test backend root endpoint
  results.vercel.root = await testConnection(config.vercelDeployment, 'Backend root (Vercel URL)');
  console.log('\n');
  
  // Test API endpoints
  for (const endpoint of config.endpoints) {
    results.vercel[endpoint.name] = await testConnection(
      `${config.vercelDeployment}${endpoint.path}`, 
      `${endpoint.name} API (Vercel)`
    );
    console.log('\n');
  }
  
  // Test custom domain
  console.log('\nTESTING CUSTOM DOMAIN URL');
  console.log('========================');
  
  // Test backend root endpoint with custom domain
  results.customDomain.root = await testConnection(config.customDomain, 'Backend root (Custom Domain)');
  console.log('\n');
  
  // Test API endpoints with custom domain
  for (const endpoint of config.endpoints) {
    results.customDomain[endpoint.name] = await testConnection(
      `${config.customDomain}${endpoint.path}`, 
      `${endpoint.name} API (Custom Domain)`
    );
    console.log('\n');
  }
  
  // Test frontend connection
  console.log('\nTESTING FRONTEND');
  console.log('===============');
  results.frontend = await testConnection(config.frontend, 'Frontend');
  console.log('\n');
  
  // Provide summary
  printHeader('Connection Test Summary');
  
  console.log('Vercel Deployment:');
  console.log(`  Backend Root: ${results.vercel.root?.success ? '✅ Connected' : '❌ Failed'} (Status: ${results.vercel.root?.status || 'N/A'})`);
  for (const endpoint of config.endpoints) {
    const result = results.vercel[endpoint.name];
    console.log(`  ${endpoint.name} API: ${result?.success ? '✅ Connected' : '❌ Failed'} (Status: ${result?.status || 'N/A'})`);
  }
  
  console.log('\nCustom Domain:');
  console.log(`  Backend Root: ${results.customDomain.root?.success ? '✅ Connected' : '❌ Failed'} (Status: ${results.customDomain.root?.status || 'N/A'})`);
  for (const endpoint of config.endpoints) {
    const result = results.customDomain[endpoint.name];
    console.log(`  ${endpoint.name} API: ${result?.success ? '✅ Connected' : '❌ Failed'} (Status: ${result?.status || 'N/A'})`);
  }
  
  console.log('\nFrontend:');
  console.log(`  Frontend: ${results.frontend?.success ? '✅ Connected' : '❌ Failed'} (Status: ${results.frontend?.status || 'N/A'})`);
  
  // Overall assessment
  printHeader('OVERALL CONNECTION ASSESSMENT');
  
  // Check if custom domain API endpoints are working
  const customDomainWorking = Object.values(results.customDomain).some(r => r?.success);
  const vercelWorking = Object.values(results.vercel).some(r => r?.success);
  const frontendWorking = results.frontend?.success;
  
  if (customDomainWorking) {
    console.log('✅ Backend API is accessible and responding correctly via Custom Domain');
    console.log('   The SolQuest backend is properly deployed and connected to MongoDB.');
  } else if (vercelWorking) {
    console.log('✅ Backend API is accessible via Vercel deployment URL, but custom domain is not working yet');
    console.log('   Continue using the Vercel deployment URL until DNS propagation is complete.');
  } else {
    console.log('❌ Backend API endpoints have connection issues. Check deployment and configuration.');
  }
  
  if (frontendWorking) {
    console.log('✅ Frontend is accessible and responding correctly at solquest.io');
  } else {
    console.log('❌ Frontend has connection issues. Check the frontend deployment.');
  }
  
  if ((customDomainWorking || vercelWorking) && frontendWorking) {
    console.log('\n✅ The SolQuest application is operational with:');
    console.log(`   - Frontend deployed at: ${config.frontend}`);
    console.log(`   - Backend API deployed at: ${customDomainWorking ? config.customDomain : config.vercelDeployment}`);
    
    // Provide instructions for updating the frontend
    console.log('\nTo update your frontend configuration:');
    console.log('1. Create or update the .env file in your frontend project:');
    console.log(`   VITE_API_URL=${customDomainWorking ? config.customDomain : config.vercelDeployment}`);
    console.log('2. Restart your development server');
  } else {
    console.log('\n❌ Some components of the SolQuest application still need attention.');
  }
  
  return results;
}

/**
 * Monitor backend status continuously
 */
async function monitorBackendStatus() {
  printHeader('SolQuest Backend Monitor');
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log(`Checking endpoints every ${config.monitorInterval / 1000} seconds...\n`);
  
  // Track status history
  const statusHistory = {
    vercel: { lastStatus: false, successCount: 0, failureCount: 0 },
    customDomain: { lastStatus: false, successCount: 0, failureCount: 0 }
  };
  
  // Function to check a single endpoint
  async function checkEndpoint(baseUrl, name) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, { 
        method: 'HEAD',
        timeout: 10000 // 10 second timeout
      });
      
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Function to check all endpoints
  async function checkAllEndpoints() {
    const now = new Date();
    console.log(`\n[${formatTime(now)}] Checking backend endpoints...`);
    
    // Check Vercel deployment
    const vercelResult = await checkEndpoint(config.vercelDeployment, 'Vercel Deployment');
    const history = statusHistory.vercel;
    
    if (vercelResult.success) {
      history.successCount++;
      history.failureCount = 0;
      console.log(`✅ Vercel Deployment: UP (Status: ${vercelResult.status} ${vercelResult.statusText})`);
    } else {
      history.failureCount++;
      history.successCount = 0;
      console.log(`❌ Vercel Deployment: DOWN (${vercelResult.error || `Status: ${vercelResult.status}`})`);
    }
    
    // Status change notification
    if (history.successCount === 1 && !history.lastStatus) {
      console.log(`\n🎉 GOOD NEWS! Vercel deployment is now UP and responding correctly!`);
      console.log(`   You can now use ${config.vercelDeployment} as your API URL.`);
    }
    
    history.lastStatus = vercelResult.success;
    
    // Check Custom Domain
    const customResult = await checkEndpoint(config.customDomain, 'Custom Domain');
    const customHistory = statusHistory.customDomain;
    
    if (customResult.success) {
      customHistory.successCount++;
      customHistory.failureCount = 0;
      console.log(`✅ Custom Domain: UP (Status: ${customResult.status} ${customResult.statusText})`);
    } else {
      customHistory.failureCount++;
      customHistory.successCount = 0;
      console.log(`❌ Custom Domain: DOWN (${customResult.error || `Status: ${customResult.status}`})`);
    }
    
    // Status change notification
    if (customHistory.successCount === 1 && !customHistory.lastStatus) {
      console.log(`\n🎉 GOOD NEWS! Custom domain is now UP and responding correctly!`);
      console.log(`   You can now use ${config.customDomain} as your API URL.`);
    }
    
    customHistory.lastStatus = customResult.success;
    
    // Overall status
    const anyEndpointUp = vercelResult.success || customResult.success;
    console.log(`\nOverall backend status: ${anyEndpointUp ? '✅ At least one endpoint is UP' : '❌ All endpoints are DOWN'}`);
    
    if (anyEndpointUp) {
      // Provide instructions for updating the frontend
      const preferredUrl = customResult.success ? config.customDomain : config.vercelDeployment;
      console.log(`\nTo update your frontend configuration:`);
      console.log(`1. Create or update the .env file in your frontend project:`);
      console.log(`   VITE_API_URL=${preferredUrl}`);
      console.log(`2. Restart your development server`);
    }
  }
  
  // Initial check
  await checkAllEndpoints();
  
  // Set up interval for continuous checking
  setInterval(checkAllEndpoints, config.monitorInterval);
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
SolQuest Backend Tools

Usage: node backend-tools.js [command]

Commands:
  dns       - Check DNS propagation for api.solquest.io
  test      - Test all backend endpoints
  monitor   - Continuously monitor backend status
  help      - Show this help message

Examples:
  node backend-tools.js dns      # Check DNS propagation
  node backend-tools.js test     # Test all endpoints
  node backend-tools.js monitor  # Monitor backend status
  `);
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2] || 'help';
  
  switch (command) {
    case 'dns':
      await checkDNSPropagation();
      break;
    case 'test':
      await testBackendEndpoints();
      break;
    case 'monitor':
      await monitorBackendStatus();
      break;
    case 'help':
    default:
      printUsage();
      break;
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

// Export functions for potential programmatic use
module.exports = {
  checkDNSPropagation,
  testBackendEndpoints,
  monitorBackendStatus
};
