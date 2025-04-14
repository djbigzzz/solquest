require('dotenv').config();
const mongoose = require('mongoose');

// Get connection string from .env file
const mongoURI = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB...');

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Connected to: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    
    // Close connection
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
    process.exit(0);
  })
  .catch(err => {
    console.error(`❌ Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
