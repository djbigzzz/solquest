// Direct MongoDB connection handler for Vercel
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
    throw err;
  });

  return connectionPromise;
};

// API handler
module.exports = async (req, res) => {
  try {
    await connectToMongoDB();
    
    // Return connection status
    res.status(200).json({
      status: 'ok',
      message: 'Database connection test',
      timestamp: new Date().toISOString(),
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState
      }
    });
  } catch (error) {
    console.error('DB connection test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection test failed',
      error: error.message
    });
  }
};
