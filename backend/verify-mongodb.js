// Simple script to verify MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

async function verifyMongoDBConnection() {
  const mongoURI = process.env.MONGODB_URI_PROD || process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
  }

  console.log('Attempting to connect to MongoDB...');
  console.log(`Connection string: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials
  
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // List all collections in the database
    console.log('\nCollections in database:');
    const collections = await conn.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    await mongoose.connection.close();
    console.log('\nConnection closed successfully');
    return true;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    return false;
  }
}

verifyMongoDBConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ MongoDB verification complete - Ready for deployment!');
    } else {
      console.log('\n❌ MongoDB verification failed - Please check your connection string');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
