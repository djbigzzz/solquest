const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for MongoDB connection string
console.log('\n=== SolQuest MongoDB Atlas Setup ===');
console.log('Please follow these steps to connect your SolQuest backend to MongoDB Atlas:');
console.log('1. Log in to MongoDB Atlas');
console.log('2. Go to your cluster and click "Connect"');
console.log('3. Click "Connect your application"');
console.log('4. Copy the connection string (it should start with mongodb+srv://)');
console.log('5. Paste it below when prompted\n');

rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
  if (!connectionString.startsWith('mongodb+srv://')) {
    console.error('Error: Invalid connection string. It should start with mongodb+srv://');
    rl.close();
    return;
  }

  // Replace database name with "solquest"
  let updatedString = connectionString.replace('?', '/solquest?');
  if (!updatedString.includes('/solquest?')) {
    updatedString = connectionString.replace('/?', '/solquest?');
  }

  // Read current .env file
  const envPath = path.join(__dirname, '.env');
  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading .env file: ${err.message}`);
      rl.close();
      return;
    }

    // Update MongoDB connection strings
    const updatedEnv = data
      .replace(/MONGODB_URI=.*/g, `MONGODB_URI=${updatedString}`)
      .replace(/MONGODB_URI_PROD=.*/g, `MONGODB_URI_PROD=${updatedString}`);

    // Write updated .env file
    fs.writeFile(envPath, updatedEnv, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to .env file: ${err.message}`);
        rl.close();
        return;
      }

      console.log('\n✅ Successfully updated .env file with MongoDB Atlas connection string!');
      console.log('\nNext steps:');
      console.log('1. Run "npm run dev" to start your backend server');
      console.log('2. You should see "MongoDB Connected: <cluster>" in the console');
      console.log('3. Your backend API will be running on http://localhost:5000');

      rl.close();
    });
  });
});

rl.on('close', () => {
  process.exit(0);
});
