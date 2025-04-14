const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// GET /api/users
router.get('/', protect, admin, userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', protect, userController.getUserById);

// PUT /api/users/:id
router.put('/:id', protect, userController.updateUser);

module.exports = router;
