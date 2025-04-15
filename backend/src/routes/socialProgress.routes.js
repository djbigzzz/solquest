const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const socialProgressController = require('../controllers/socialProgress.controller');

// POST /api/progress/social - Validate a social subtask (Twitter, Discord, etc.)
router.post('/social', protect, socialProgressController.validateSocialSubtask);

module.exports = router;
