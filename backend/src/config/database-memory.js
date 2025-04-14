const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectMemoryDB = async () => {
  try {
    // Create an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
    console.log(`Using in-memory database for development`);
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB Memory Server: ${error.message}`);
    process.exit(1);
  }
};

const disconnectMemoryDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB Memory Server disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB Memory Server: ${error.message}`);
  }
};

module.exports = {
  connectMemoryDB,
  disconnectMemoryDB
};
