const mongoose = require('mongoose');

// Cache the database connection for serverless environment
let cachedConnection = null;

/**
 * Connect to MongoDB database with connection pooling for serverless environments
 */
const connectDB = async () => {
  // If we already have a connection, reuse it
  if (cachedConnection) {
    console.log('Using existing database connection');
    return cachedConnection;
  }

  try {
    // Determine which connection string to use
    const mongoURI = process.env.MONGODB_URI || 
                     process.env.MONGODB_URI_PROD || 
                     'mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0';
    
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      return null;
    }

    // Configure mongoose for serverless environment
    mongoose.set('strictQuery', false);
    
    // Connect with proper options for serverless
    const conn = await mongoose.connect(mongoURI, {
      // Serverless-friendly options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
