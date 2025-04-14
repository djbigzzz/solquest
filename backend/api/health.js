// Simple health check endpoint for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SolQuest API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};
