# SolQuest Backend Integration Guide

This guide explains how to monitor and test the SolQuest backend API integration, and how to proceed once the backend becomes available.

## Backend Tools

We've created a consolidated utility script (`backend-tools.js`) that provides several functions for monitoring and testing the SolQuest backend:

### 1. Check DNS Propagation

```bash
node backend-tools.js dns
```

This command checks the DNS propagation status for `api.solquest.io` by querying multiple DNS servers around the world. It helps you determine if the custom domain is fully propagated and ready to use.

### 2. Test Backend Endpoints

```bash
node backend-tools.js test
```

This command tests all backend endpoints to verify that they're working correctly. It checks both the Vercel deployment URL and the custom domain, and provides a summary of the results.

### 3. Monitor Backend Status

```bash
node backend-tools.js monitor
```

This command continuously monitors the status of the backend API and notifies you when it becomes available. It's useful for checking when the backend is ready for integration.

## Integration Steps

Once the backend becomes available, follow these steps to complete the integration:

1. **Update Environment Variables**

   Create or update the `.env` file in the frontend project with the correct API URL:

   ```env
   VITE_API_URL=https://api.solquest.io
   ```

   If the custom domain is not yet available, you can use the Vercel deployment URL as a fallback:

   ```env
   VITE_API_URL=https://solquest-app.vercel.app
   ```

2. **Test the Integration**

   Run the backend test script to verify that all endpoints are working correctly:

   ```bash
   node backend-tools.js test
   ```

3. **Start the Development Server**

   Start the development server to test the integration locally:

   ```bash
   npm run dev
   ```

4. **Verify Frontend Components**

   Verify that the following components are correctly fetching data from the backend:

   - QuestsPage: Should display quests from the backend
   - QuestDetail: Should display quest details from the backend
   - Leaderboard: Should display leaderboard data from the backend
   - UserProfile: Should display user profile data from the backend

5. **Deploy to Production**

   Once you've verified that everything is working correctly, deploy the updated frontend to production:

   ```bash
   npm run build
   ```

   Then deploy the built files to Vercel or your preferred hosting provider.

## Backend Information

The SolQuest backend is deployed to Vercel and uses MongoDB Atlas for data storage. The backend API is accessible at:

- Custom Domain: `https://api.solquest.io`
- Vercel Deployment: `https://solquest-app.vercel.app`

The frontend is deployed at `https://solquest.io`.

## Troubleshooting

If you encounter any issues with the backend integration, try the following:

1. **Check Backend Status**

   Run the backend monitor to check if the backend is available:

   ```bash
   node backend-tools.js monitor
   ```

2. **Check DNS Propagation**

   If the custom domain is not working, check the DNS propagation status:

   ```bash
   node backend-tools.js dns
   ```

3. **Use Fallback URL**

   If the custom domain is not available, update the `.env` file to use the Vercel deployment URL:

   ```env
   VITE_API_URL=https://solquest-app.vercel.app
   ```

4. **Check Console Logs**

   Check the browser console for any API errors or connection issues.

5. **Verify Environment Variables**

   Make sure the environment variables are correctly set in the Vercel deployment.

## Offline Support

The frontend includes a robust caching system that allows it to function even when the backend is not accessible. When the backend is unavailable, the frontend will:

1. Display a notification indicating that it's using cached data
2. Store user actions locally and sync them when the backend becomes available
3. Provide a "Try Reconnecting" button to attempt to reconnect to the backend

This ensures that users can still interact with the application even when they're offline or when the backend is temporarily unavailable.
