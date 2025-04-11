# SolQuest Backend Implementation Plan

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  React      │     │  Express    │     │  MongoDB    │
│  Frontend   │◄────►  Backend    │◄────►  Database   │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │
                    ┌──────▼──────┐
                    │             │
                    │  Solana     │
                    │  Blockchain │
                    │             │
                    └─────────────┘
```

## Technology Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB (for user data, referrals, quest progress)
- **Authentication**: JWT with Solana wallet signatures
- **Blockchain Integration**: @solana/web3.js
- **Hosting**: Render.com or Heroku

## Core Features to Implement

### 1. User Authentication

- Wallet-based authentication using message signing
- JWT token generation and validation
- User profile management

### 2. Referral System

- Generate and validate referral codes
- Track referral relationships between users
- Calculate and distribute rewards
- Store referral history and statistics

### 3. Quest Management

- Store quest definitions and requirements
- Track user progress on quests
- Validate quest completion
- Distribute rewards upon completion

### 4. Leaderboard

- Track user points and achievements
- Generate global and quest-specific leaderboards
- Update rankings in real-time

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with wallet signature
- `GET /api/auth/profile` - Get user profile

### Referrals
- `POST /api/referrals/generate` - Generate referral code
- `POST /api/referrals/validate` - Validate a referral code
- `GET /api/referrals/stats` - Get referral statistics
- `POST /api/referrals/claim-rewards` - Claim referral rewards

### Quests
- `GET /api/quests` - Get all available quests
- `GET /api/quests/:id` - Get specific quest details
- `POST /api/quests/:id/progress` - Update quest progress
- `POST /api/quests/:id/complete` - Mark quest as complete

### Leaderboard
- `GET /api/leaderboard/global` - Get global leaderboard
- `GET /api/leaderboard/quests/:id` - Get quest-specific leaderboard
- `GET /api/leaderboard/referrals` - Get referral leaderboard

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  walletAddress: String,
  username: String,
  avatar: String,
  joinedAt: Date,
  points: Number,
  completedQuests: [ObjectId],
  referralCode: String,
  referredBy: ObjectId,
  referrals: [ObjectId],
  rewardsEarned: Number,
  rewardsClaimed: Number
}
```

### Quest Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  imageUrl: String,
  rewards: {
    points: Number,
    sol: Number,
    nft: Boolean
  },
  tasks: [{
    id: String,
    title: String,
    description: String,
    type: String,
    validation: Object
  }],
  startDate: Date,
  endDate: Date,
  participants: Number,
  completions: Number
}
```

### QuestProgress Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  questId: ObjectId,
  startedAt: Date,
  completedAt: Date,
  progress: [{
    taskId: String,
    completed: Boolean,
    completedAt: Date,
    proof: String
  }],
  rewardClaimed: Boolean
}
```

### Referral Collection
```javascript
{
  _id: ObjectId,
  referrerId: ObjectId,
  referredId: ObjectId,
  code: String,
  createdAt: Date,
  convertedAt: Date,
  questsCompleted: Number,
  rewardsEarned: Number,
  rewardsClaimed: Number
}
```

## Implementation Phases

### Phase 1: Core Backend Setup
- Set up Express server
- Configure MongoDB connection
- Implement wallet authentication
- Create basic user profiles

### Phase 2: Referral System
- Generate and store referral codes
- Track referral relationships
- Implement referral validation

### Phase 3: Quest Management
- Create quest data models
- Implement progress tracking
- Build validation mechanisms

### Phase 4: Rewards & Leaderboard
- Implement reward distribution
- Create leaderboard endpoints
- Set up scheduled tasks for updates

### Phase 5: Integration & Testing
- Connect frontend to backend
- Test all features end-to-end
- Performance optimization

## Deployment Strategy
- Set up CI/CD pipeline
- Configure environment variables
- Deploy to production environment
- Monitor performance and errors
