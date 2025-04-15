const mongoose = require('mongoose');

// Cache the database connection for serverless environment
let cachedConnection = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

/**
 * Connect to MongoDB database with connection pooling for serverless environments
 */
const connectDB = async () => {
  // If we already have a connection, reuse it
  if (cachedConnection) {
    console.log('Using existing database connection');
    return cachedConnection;
  }

  // Determine which connection string to use - NEVER hardcode credentials
  const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD;
  
  if (!mongoURI) {
    console.error('ERROR: MongoDB URI is not defined in environment variables');
    console.error('Please set MONGODB_URI or MONGODB_URI_PROD in your environment variables');
    throw new Error('MongoDB URI is required but not provided');
  }

  // Configure mongoose for serverless environment
  mongoose.set('strictQuery', false);
  
  // Implement retry logic
  while (connectionAttempts < MAX_RETRY_ATTEMPTS) {
    try {
      connectionAttempts++;
      console.log(`MongoDB connection attempt ${connectionAttempts} of ${MAX_RETRY_ATTEMPTS}`);
      
      // Connect with proper options for serverless
      const conn = await mongoose.connect(mongoURI, {
        // Serverless-friendly options
        serverSelectionTimeoutMS: 10000, // Increased timeout
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 30000,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10, // Optimize connection pool size
      });
      
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      // Set up connection error handlers
      conn.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        cachedConnection = null; // Reset cached connection on error
      });
      
      conn.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
        cachedConnection = null; // Reset cached connection on disconnect
      });
      
      // Cache the connection
      cachedConnection = conn;
      return conn;
    } catch (error) {
      console.error(`Error connecting to MongoDB (attempt ${connectionAttempts}): ${error.message}`);
      
      if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
        console.log(`Retrying in ${RETRY_INTERVAL/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        console.error('Maximum connection attempts reached. Could not connect to MongoDB.');
        throw error; // Rethrow the error after max retries
      }
    }
  }
};

module.exports = connectDB;
