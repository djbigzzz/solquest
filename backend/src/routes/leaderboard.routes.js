const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');

// GET /api/leaderboard - Get global leaderboard
router.get('/', leaderboardController.getGlobalLeaderboard);

// GET /api/leaderboard/weekly - Get weekly leaderboard
router.get('/weekly', leaderboardController.getWeeklyLeaderboard);

module.exports = router;
