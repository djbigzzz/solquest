# SolQuest Frontend-Backend Integration

This document explains how the SolQuest frontend connects to the backend API and how to work with the integration.

## API Configuration

The frontend connects to the backend API using the following configuration:

- **Production API URL**: `https://api.solquest.io`
- **API Service File**: `src/services/api.js`

## Environment Variables

The frontend uses the following environment variables for API configuration:

```env
VITE_API_URL=https://api.solquest.io
```

You can set these variables in a `.env` file at the root of the project. A template is provided in `.env.example`.

## API Services

The frontend uses the following API services to communicate with the backend:

### Authentication API

- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`
- **Check Auth Status**: `GET /api/auth/status`

### Quests API

- **Get All Quests**: `GET /api/quests`
- **Get Quest by ID**: `GET /api/quests/:id`
- **Start Quest**: `POST /api/quests/:id/start`
- **Complete Quest Step**: `POST /api/quests/:id/steps/:stepId/complete`

### User API

- **Get User Profile**: `GET /api/users/profile`
- **Update User Profile**: `PUT /api/users/profile`
- **Get User Quest Progress**: `GET /api/users/quests`

### Leaderboard API

- **Get Leaderboard**: `GET /api/leaderboard`

### Referral API

- **Get Referral Code**: `GET /api/referrals/code`
- **Get Referral Stats**: `GET /api/referrals/stats`
- **Apply Referral Code**: `POST /api/referrals/apply`

## Custom Hooks

The frontend uses the following custom hooks to interact with the backend API:

- **useAuth**: Handles authentication with the backend
- **useQuests**: Fetches and manages quests from the backend
- **useLeaderboard**: Fetches and manages leaderboard data
- **useUserProfile**: Manages user profile data
- **useReferrals**: Handles referral system integration

## Authentication Flow

1. User connects their Solana wallet
2. Frontend requests a signature from the wallet
3. Signature is sent to the backend for verification
4. Backend verifies the signature and returns a JWT token
5. Frontend stores the token in localStorage
6. Token is included in all subsequent API requests

## Error Handling and Offline Support

The API service includes error handling for common scenarios:

- **401 Unauthorized**: Automatically logs the user out and redirects to login
- **Network Errors**: Displayed to the user with appropriate error messages
- **API Errors**: Handled gracefully with user-friendly messages

The frontend also includes robust offline support:

- **Caching**: API responses are cached locally for offline access
- **Visual Indicators**: Clear indicators when using cached data
- **Reconnection**: Ability to try reconnecting to the backend
- **Offline Actions**: User actions are stored locally and synced when back online

## Testing the Integration

Once the backend API is fully deployed and the DNS for `api.solquest.io` has propagated, you can test the integration using the consolidated backend tools script:

```bash
node backend-tools.js test
```

This command will check the connection between the frontend and backend and verify that all API endpoints are working correctly.

You can also monitor the backend status continuously:

```bash
node backend-tools.js monitor
```

Or check the DNS propagation status:

```bash
node backend-tools.js dns
```

For more details, see the `BACKEND-INTEGRATION-GUIDE.md` file.
