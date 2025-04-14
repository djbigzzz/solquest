const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { connectMemoryDB } = require('./config/database-memory');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database - with better handling for serverless environment
let dbConnected = false;

const connectToDatabase = async () => {
  if (dbConnected) return; // Prevent multiple connections
  
  if (process.env.USE_MEMORY_DB === 'true') {
    // Use in-memory database for development
    await connectMemoryDB();
  } else {
    // Use MongoDB Atlas
    await connectDB();
  }
  
  dbConnected = true;
  console.log('Database connection established');
};

// Initialize database connection
connectToDatabase().catch(err => {
  console.error('Database connection error:', err.message);
});

// Middleware
app.use(helmet()); // Security headers
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'https://solquest.io', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/quests', require('./routes/quest.routes'));
app.use('/api/referrals', require('./routes/referral.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to SolQuest API',
    version: '1.0.0',
    status: 'online'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// For local development, listen on the port
// For Vercel, we'll export the app directly
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;
