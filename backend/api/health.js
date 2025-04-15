// Health check endpoint for Vercel with MongoDB connection status
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  try {
    // Check MongoDB connection status
    let dbStatus = 'disconnected';
    let dbDetails = null;
    
    // Only check MongoDB if we're not using memory DB
    if (process.env.USE_MEMORY_DB !== 'true') {
      // Check if mongoose is connected
      if (mongoose.connection && mongoose.connection.readyState) {
        dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
        
        if (dbStatus === 'connected') {
          dbDetails = {
            host: mongoose.connection.host,
            name: mongoose.connection.name,
          };
        }
      }
    } else {
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
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};
