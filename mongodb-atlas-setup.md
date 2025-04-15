# MongoDB Atlas Configuration Guide

## IP Whitelist Configuration

One common issue with MongoDB Atlas connections from cloud platforms like Vercel is IP restrictions. By default, MongoDB Atlas only allows connections from whitelisted IP addresses.

### Steps to Allow Connections from Vercel:

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com/)
2. Select your cluster (Cluster0)
3. Click on the "Network Access" tab in the left sidebar
4. Click the "Add IP Address" button
5. To allow connections from Vercel, add `0.0.0.0/0` (this allows connections from any IP address)
   - Note: This is less secure but necessary for serverless platforms like Vercel
   - For production, you might want to restrict this later
6. Click "Confirm" to save the changes

## Database User Configuration

Ensure your database user has the correct permissions:

1. Go to the "Database Access" tab in MongoDB Atlas
2. Check that the user `solquest-admin` exists and has the appropriate roles
   - It should have at least `readWrite` access to the `solquest` database
3. If needed, reset the password and update your environment variables

## Testing the Connection

After making these changes, you can test the connection:

1. Wait a few minutes for the changes to propagate
2. Check the health endpoint at `https://solquest.io/api/health`
3. The database status should change from "disconnected" to "connected"

## Vercel Environment Variables

If the IP whitelist changes don't resolve the issue, make sure to set the environment variables directly in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add `MONGODB_URI_PROD` with the connection string value
4. Redeploy your application
