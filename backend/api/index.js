// Serverless entry point for Vercel
const app = require('../src/server');
const dbConnectHandler = require('./db-connect');
const healthHandler = require('./health');

// Special handler for specific routes
const handler = async (req, res) => {
  console.log(`Handling request for: ${req.url}`);
  
  // Check if this is a request for the db-connect endpoint
  if (req.url === '/api/db-connect' || req.url === '/db-connect') {
    console.log('Routing to db-connect handler');
    return dbConnectHandler(req, res);
  }
  
  // Check if this is a request for the health endpoint
  if (req.url === '/api/health' || req.url === '/health') {
    console.log('Routing to health handler');
    return healthHandler(req, res);
  }
  
  // Otherwise, use the main Express app
  return app(req, res);
};

// Export the handler as a serverless function
module.exports = handler;
