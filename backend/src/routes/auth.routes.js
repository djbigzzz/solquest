const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/auth/nonce
router.get('/nonce', authController.getNonce);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profile
router.get('/profile', protect, authController.getProfile);

// PUT /api/auth/profile
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
