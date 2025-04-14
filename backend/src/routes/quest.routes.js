const express = require('express');
const router = express.Router();
const questController = require('../controllers/quest.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// GET /api/quests - Get all quests
router.get('/', questController.getAllQuests);

// GET /api/quests/:id - Get quest by ID
router.get('/:id', questController.getQuestById);

// POST /api/quests - Create new quest (admin only)
router.post('/', protect, admin, questController.createQuest);

// PUT /api/quests/:id - Update quest (admin only)
router.put('/:id', protect, admin, questController.updateQuest);

// DELETE /api/quests/:id - Delete quest (admin only)
router.delete('/:id', protect, admin, questController.deleteQuest);

// POST /api/quests/:id/start - Start a quest
router.post('/:id/start', protect, questController.startQuest);

// POST /api/quests/:id/complete - Complete a quest
router.post('/:id/complete', protect, questController.completeQuest);

module.exports = router;
