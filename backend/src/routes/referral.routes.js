const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/referrals - Get user's referrals
router.get('/', protect, referralController.getUserReferrals);

// POST /api/referrals/create - Create a new referral code
router.post('/create', protect, referralController.createReferralCode);

// POST /api/referrals/redeem - Redeem a referral code
router.post('/redeem', protect, referralController.redeemReferralCode);

module.exports = router;
