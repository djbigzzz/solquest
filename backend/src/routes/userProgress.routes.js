const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/userProgress.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/progress - Get user progress
router.get('/', protect, userProgressController.getUserProgress);

// POST /api/progress/twitter - Update Twitter quest progress
router.post('/twitter', protect, userProgressController.updateTwitterQuest);

// POST /api/progress/nft - Update NFT quest progress
router.post('/nft', protect, userProgressController.updateNFTQuest);

module.exports = router;
