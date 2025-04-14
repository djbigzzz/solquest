const User = require('../models/user.model');

/**
 * Get global leaderboard
 * @route GET /api/leaderboard
 */
const getGlobalLeaderboard = async (req, res) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Find users sorted by points (descending)
    const leaderboard = await User.find({})
      .select('username walletAddress points profileImage')
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments();
    
    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

/**
 * Get weekly leaderboard
 * @route GET /api/leaderboard/weekly
 */
const getWeeklyLeaderboard = async (req, res) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Calculate start of current week (Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Get the previous Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Start of day
    
    // Find quests completed this week and group by user
    const weeklyLeaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'questprogresses',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$user', '$$userId'] },
                status: 'completed',
                completedAt: { $gte: startOfWeek }
              }
            }
          ],
          as: 'completedQuests'
        }
      },
      {
        $lookup: {
          from: 'quests',
          localField: 'completedQuests.quest',
          foreignField: '_id',
          as: 'questDetails'
        }
      },
      {
        $addFields: {
          weeklyPoints: {
            $sum: '$questDetails.pointsReward'
          }
        }
      },
      {
        $sort: { weeklyPoints: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          username: 1,
          walletAddress: 1,
          profileImage: 1,
          weeklyPoints: 1,
          completedQuestsCount: { $size: '$completedQuests' }
        }
      }
    ]);
    
    // Get total users with activity this week for pagination
    const totalActiveUsers = await User.aggregate([
      {
        $lookup: {
          from: 'questprogresses',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$user', '$$userId'] },
                status: 'completed',
                completedAt: { $gte: startOfWeek }
              }
            }
          ],
          as: 'completedQuests'
        }
      },
      {
        $match: {
          completedQuests: { $ne: [] }
        }
      },
      {
        $count: 'totalActiveUsers'
      }
    ]);
    
    const totalUsers = totalActiveUsers.length > 0 ? totalActiveUsers[0].totalActiveUsers : 0;
    
    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      startDate: startOfWeek,
      leaderboard: weeklyLeaderboard
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

module.exports = {
  getGlobalLeaderboard,
  getWeeklyLeaderboard
};
