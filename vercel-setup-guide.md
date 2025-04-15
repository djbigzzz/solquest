# Vercel Deployment Setup Guide for SolQuest

## Environment Variables Setup

To fix the MongoDB connection issue, you need to set the following environment variables directly in your Vercel project settings:

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the `solquest-app-new` project
3. Go to "Settings" tab
4. Click on "Environment Variables" in the left sidebar
5. Add the following environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI_PROD` | `mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0` | Production |
| `NODE_ENV` | `production` | Production |

6. Click "Save" to apply the changes
7. Go to the "Deployments" tab
8. Find your latest deployment and click on the three dots (⋮)
9. Select "Redeploy" to deploy with the new environment variables

## Verifying the Setup

After redeploying, you can verify that the MongoDB connection is working by:

1. Checking the deployment logs in the Vercel dashboard
2. Visiting `https://solquest.io/api/health` and confirming that the database status shows "connected"

## Troubleshooting

If the database still shows as "disconnected" after setting the environment variables:

1. Check if MongoDB Atlas has IP restrictions - you may need to whitelist Vercel's IP addresses
2. Verify that the MongoDB user has the correct permissions
3. Check if your MongoDB Atlas cluster is in an available state

## Local Development

For local development, you can add these environment variables to a `.env` file in the root of your project:

```
MONGODB_URI=mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

**Note:** Do not commit the `.env` file to your repository as it contains sensitive information.
