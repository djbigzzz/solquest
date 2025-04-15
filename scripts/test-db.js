/**
 * MongoDB Connection Test Script
 * This script tests the MongoDB connection using the connection string from environment variables
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Get the MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD || 'mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');
console.log(`Using MongoDB URI: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs

// Connect to MongoDB
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  console.log(`Connected to: ${mongoose.connection.host}`);
  console.log(`Database name: ${mongoose.connection.name}`);
  console.log(`Connection state: ${mongoose.connection.readyState}`);
  
  // Test a simple query
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('✅ MongoDB ping successful!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error(err);
  process.exit(1);
});
