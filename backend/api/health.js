// Health check endpoint for Vercel with MongoDB connection status
const mongoose = require('mongoose');

// Connection URI - using fallback if environment variables are not set
const MONGODB_URI = process.env.MONGODB_URI || 
                   process.env.MONGODB_URI_PROD || 
                   'mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0';

// Track the connection
let isConnected = false;
let connectionPromise = null;

// Connect to MongoDB
const connectToMongoDB = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return Promise.resolve();
  }

  if (connectionPromise) {
    console.log('=> Using existing connection promise');
    return connectionPromise;
  }

  console.log('=> Using new database connection');
  
  // Log connection attempt (with masked credentials)
  const maskedURI = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log(`Attempting MongoDB connection with URI: ${maskedURI}`);

  // Create new connection promise
  connectionPromise = mongoose.connect(MONGODB_URI, {
    // Serverless-friendly options for Vercel
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 5000,
    heartbeatFrequencyMS: 30000,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 5,
    autoIndex: false,
    bufferCommands: false,
    family: 4,
  })
  .then(db => {
    isConnected = true;
    connectionPromise = null;
    console.log(`Connected to MongoDB: ${db.connection.host}`);
    return db;
  })
  .catch(err => {
    connectionPromise = null;
    console.error('MongoDB connection error:', err);
    return null; // Don't throw, just return null to continue health check
  });

  return connectionPromise;
};

module.exports = async (req, res) => {
  try {
    // Try to connect to MongoDB
    await connectToMongoDB();
    
    // Check MongoDB connection status
    let dbStatus = 'disconnected';
    let dbDetails = null;
    
    // Only check MongoDB if we're not using memory DB
    if (process.env.USE_MEMORY_DB !== 'true') {
      // Check if mongoose is connected
      if (mongoose.connection && mongoose.connection.readyState) {
        dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
        
        if (dbStatus === 'connected') {
          dbDetails = {
            host: mongoose.connection.host,
            name: mongoose.connection.name,
          };
        }
      }
    } else {
      dbStatus = 'memory-db';
    }
    
    // Return health status
    res.status(200).json({
      status: 'ok',
      message: 'SolQuest API is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        details: dbDetails,
        connectionString: MONGODB_URI ? 'provided' : 'missing'
      },
      uptime: Math.floor(process.uptime()) + ' seconds'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};
