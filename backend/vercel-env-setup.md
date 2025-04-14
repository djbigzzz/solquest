# SolQuest Backend - Vercel Environment Variables Setup

## Important: Use the Correct MongoDB Connection String

The MongoDB connection string from your memory data is:
```
mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0
```

## Steps to Set Up Environment Variables in Vercel Dashboard

Since the CLI is having issues with the long connection string, please follow these steps to set up the environment variables in the Vercel dashboard:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the "solquest" project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | MONGODB_URI | mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0 | Production |
   | MONGODB_URI_PROD | mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0 | Production |
   | NODE_ENV | production | Production |
   | JWT_SECRET | solquest_production_secret_key_change_in_production | Production |
   | JWT_EXPIRATION | 7d | Production |
   | FRONTEND_URL | https://solquest.io | Production |
   | USE_MEMORY_DB | false | Production |

5. Click "Save" after adding each variable
6. After adding all variables, redeploy your backend by running:
   ```
   vercel --prod
   ```

## Verify the Connection

After setting up the environment variables and redeploying, run the test script to verify the connection:
```
node test-deployed-backend.js
```

## Custom Domain Setup

You've already added the custom domain `api.solquest.io` to your project. Make sure to configure your DNS with the following record:

- Type: A
- Host/Name: api
- Value/Target: 76.76.21.21

DNS changes can take up to 48 hours to propagate, but usually happen within a few hours.
