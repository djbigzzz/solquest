# SolQuest Backend - Vercel Environment Variables Setup Guide

To ensure the SolQuest backend connects properly to the MongoDB database and works with the frontend, you need to set up the following environment variables in the Vercel dashboard.

## Required Environment Variables

1. **MongoDB Connection**
   - `MONGODB_URI`: `mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0`
   - `MONGODB_URI_PROD`: `mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0`

2. **Server Configuration**
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Note: Vercel will override this, but it's good to have it set)

3. **JWT Configuration**
   - `JWT_SECRET`: `solquest_production_secret_key_change_in_production`
   - `JWT_EXPIRATION`: `7d`

4. **CORS Configuration**
   - `FRONTEND_URL`: `https://solquest.io`

5. **Database Configuration**
   - `USE_MEMORY_DB`: `false`

## Steps to Set Up Environment Variables in Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the SolQuest project
3. Go to "Settings" > "Environment Variables"
4. Add each of the environment variables listed above
5. Make sure to add them to the "Production" environment
6. Click "Save" to apply the changes
7. Redeploy the backend to apply the new environment variables

## Custom Domain Setup (Optional)

If you want to use a custom domain for the backend (e.g., api.solquest.io):

1. Go to "Settings" > "Domains"
2. Add your custom domain (e.g., api.solquest.io)
3. Follow the instructions to verify domain ownership
4. Update the frontend code to use the new backend URL

## Verifying the Setup

After setting up the environment variables and redeploying, you can verify the connection by:

1. Visiting the backend root URL: https://solquest-nq945tz02-mystartup-team.vercel.app/
2. Testing an API endpoint: https://solquest-nq945tz02-mystartup-team.vercel.app/api/leaderboard

If everything is set up correctly, you should see proper JSON responses instead of errors.
