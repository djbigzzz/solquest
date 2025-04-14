const User = require('../models/user.model');
const Referral = require('../models/referral.model');
const crypto = require('crypto');

/**
 * Get user's referrals
 * @route GET /api/referrals
 */
const getUserReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referee', 'username walletAddress')
      .sort({ createdAt: -1 });
    
    const referralStats = {
      totalReferrals: referrals.length,
      totalPoints: referrals.reduce((acc, ref) => acc + (ref.pointsAwarded || 0), 0),
      referrals
    };
    
    res.json(referralStats);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Create a new referral code
 * @route POST /api/referrals/create
 */
const createReferralCode = async (req, res) => {
  try {
    // Generate a unique referral code if one doesn't exist
    if (!req.user.referralCode) {
      // Generate a random code and check if it's unique
      let isUnique = false;
      let referralCode;
      
      while (!isUnique) {
        // Generate a short, readable referral code
        referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        
        // Check if code already exists
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) {
          isUnique = true;
        }
      }
      
      // Save the unique code to the user
      req.user.referralCode = referralCode;
      await req.user.save();
    }
    
    res.json({
      referralCode: req.user.referralCode,
      referralLink: `https://solquest.io/refer/${req.user.referralCode}`
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Redeem a referral code
 * @route POST /api/referrals/redeem
 */
const redeemReferralCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        error: true,
        message: 'Referral code is required'
      });
    }
    
    // Find user with this referral code
    const referrer = await User.findOne({ referralCode: code });
    
    if (!referrer) {
      return res.status(404).json({
        error: true,
        message: 'Invalid referral code'
      });
    }
    
    // Check if user is trying to refer themselves
    if (referrer._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: true,
        message: 'You cannot refer yourself'
      });
    }
    
    // Check if this referral already exists
    const existingReferral = await Referral.findOne({
      referrer: referrer._id,
      referee: req.user._id
    });
    
    if (existingReferral) {
      return res.status(400).json({
        error: true,
        message: 'Referral already processed'
      });
    }
    
    // Create the referral record
    const pointsAwarded = 100; // Points for both referrer and referee
    const referral = await Referral.create({
      referrer: referrer._id,
      referee: req.user._id,
      code,
      pointsAwarded
    });
    
    // Award points to both users
    referrer.points += pointsAwarded;
    req.user.points += pointsAwarded;
    
    await referrer.save();
    await req.user.save();
    
    res.json({
      message: 'Referral code redeemed successfully',
      pointsAwarded,
      totalPoints: req.user.points
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

module.exports = {
  getUserReferrals,
  createReferralCode,
  redeemReferralCode
};
