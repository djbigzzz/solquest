const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();


// Middleware
// Configure Helmet with relaxed settings for development
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
})); 

// CORS configuration
// Helper to normalize origins (lowercase, remove trailing slashes)
function normalizeOrigin(origin) {
  return origin ? origin.toLowerCase().replace(/\/$/, '') : origin;
}

let allowedOrigins = [
  'https://solquest.io',
  'https://www.solquest.io',
  'https://solquest-app-new.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
];

// Add any environment-specific frontend URLs
if (process.env.FRONTEND_URL) {
  // Remove markdown formatting if present (defensive)
  const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\[.*?\]\((.*?)\)/, '$1').trim();
  if (!allowedOrigins.includes(cleanFrontendUrl)) {
    allowedOrigins.push(cleanFrontendUrl);
  }
}

// Normalize all allowed origins
allowedOrigins = allowedOrigins.map(normalizeOrigin);
console.log('[CORS] Allowed origins:', allowedOrigins);

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    const normOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normOrigin)) {
      callback(null, true)
    } else {
      console.log('[CORS] Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.ip} ${req.method} ${req.path}`);
  next();
});

// Health check route - must be defined before other routes
// Redeploy trigger comment
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbDetails = null;
  let canQuery = false;
  let queryError = null;
  let testDoc = null;

  try {
    if (process.env.USE_MEMORY_DB !== 'true' && mongoose.connection) {
      dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
      if (dbStatus === 'connected') {
        dbDetails = {
          host: mongoose.connection.host,
          name: mongoose.connection.name,
        };
        // TEST: Actually run a query
        const UserProgress = require('./models/userProgress.model');
        testDoc = await UserProgress.findOne();
        canQuery = true;
      }
    } else if (process.env.USE_MEMORY_DB === 'true') {
      dbStatus = 'memory-db';
      canQuery = true;
    }
  } catch (err) {
    queryError = err.message || err;
    canQuery = false;
  }

  res.status(200).json({
    status: 'ok',
    message: 'SolQuest API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      details: dbDetails,
      canQuery,
      queryError,
      testDoc: testDoc ? { _id: testDoc._id, walletAddress: testDoc.walletAddress } : null
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
app.use('/api/admin', require('./routes/admin.routes'));

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel
module.exports = app;
