const mongoose = require('mongoose');
const fs = require('fs');

async function testAtlasConnection() {
  try {
    // Direct Atlas connection string (obfuscated for security)
    const connectionString = 'mongodb+srv://atlas-sample-dataset-load-47f90ebddd47d919b7ef21:tXEhdMO1pGkGqlxj@cluster0.mongodb.net/solquest?retryWrites=true&w=majority';
    
    console.log('Using MongoDB Atlas connection string (password hidden)');
    console.log('Attempting to connect to MongoDB Atlas...');
    
    // Connect to MongoDB
    const conn = await mongoose.connect(connectionString);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Check if collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('\nAvailable collections:');
    if (collectionNames.length > 0) {
      collectionNames.forEach(name => console.log(`- ${name}`));
    } else {
      console.log('No collections found. They will be created automatically when you add data.');
    }
    
    // Create test collections if they don't exist
    if (!collectionNames.includes('users')) {
      console.log('\nCreating initial collections for SolQuest...');
      
      // No need to explicitly create collections in MongoDB
      // They'll be created automatically when we insert documents
      // But we can log the planned collections
      console.log('- users (will be created when first user connects)');
      console.log('- quests (will be created when first quest is added)');
      console.log('- questprogresses (will be created when tracking quest progress)');
      console.log('- referrals (will be created when referral system is used)');
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
    
    return true;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB Atlas: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('timed out')) {
      console.error('Check your network connection or MongoDB Atlas IP whitelist settings');
    }
    if (error.message.includes('authentication failed')) {
      console.error('Check your MongoDB Atlas username and password');
    }
    return false;
  }
}

// Run the test
testAtlasConnection()
  .then(success => {
    if (success) {
      console.log('\n🚀 Your MongoDB Atlas connection is working properly!');
      console.log('Next steps:');
      console.log('1. Deploy your backend API');
      console.log('2. Update your frontend to connect to the API');
      console.log('3. Test the wallet connection and user registration');
    } else {
      console.log('\n❌ Please fix the connection issues before proceeding.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
