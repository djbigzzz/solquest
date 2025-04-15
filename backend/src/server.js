const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
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

// Initialize database connection with better error handling
(async () => {
  try {
    // Log MongoDB connection string (with credentials masked)
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD;
    if (mongoURI) {
      const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
      console.log(`Attempting to connect to MongoDB: ${maskedURI}`);
    } else {
      console.error('WARNING: No MongoDB connection string found in environment variables');
    }
    
    await connectToDatabase();
    console.log('Database connection initialized successfully');
    
    // Log connection details
    if (mongoose.connection) {
      console.log(`MongoDB connected to: ${mongoose.connection.host}`);
      console.log(`Database name: ${mongoose.connection.name}`);
      console.log(`Connection state: ${mongoose.connection.readyState}`);
    }
  } catch (err) {
    console.error('CRITICAL: Database connection error:', err.message);
    // In production, we might want to exit the process if DB connection fails
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_NO_DB) {
      console.error('Exiting due to database connection failure in production');
      process.exit(1); // Exit with error code
    }
  }
})();

// Middleware
// Configure Helmet with relaxed settings for development
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
})); 

// CORS configuration
const allowedOrigins = [
  'https://solquest.io',
  'https://www.solquest.io',
  'https://solquest-app-new.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
];

// Add any environment-specific frontend URLs
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// Health check route - must be defined before other routes
app.get('/api/health', (req, res) => {
  // Check MongoDB connection status
  let dbStatus = 'disconnected';
  let dbDetails = null;
  
  // Only check MongoDB if we're not using memory DB
  if (process.env.USE_MEMORY_DB !== 'true' && mongoose.connection) {
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
    
    if (dbStatus === 'connected') {
      dbDetails = {
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      };
    }
  } else if (process.env.USE_MEMORY_DB === 'true') {
    dbStatus = 'memory-db';
  }
  
  // Return health status
  res.status(200).json({
    status: 'ok',
    message: 'SolQuest API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      details: dbDetails,
    },
    uptime: Math.floor(process.uptime()) + ' seconds'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/quests', require('./routes/quest.routes'));
app.use('/api/referrals', require('./routes/referral.routes'));
app.use('/api/leaderboard', require('./routes/leaderboard.routes'));
app.use('/api/progress', require('./routes/userProgress.routes'));
app.use('/api/progress', require('./routes/socialProgress.routes'));

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
