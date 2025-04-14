# MongoDB Connection String Fix

## The Issue
The logs show an error: `Error connecting to MongoDB: querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net`

This means the MongoDB connection string in your Vercel environment variables has an incorrect hostname. It's using `cluster0.mongodb.net` instead of the correct `cluster0.ou2xdtu.mongodb.net`.

## The Correct Connection String
According to your project's memory data, the correct MongoDB connection string is:

```
mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0
```

## Steps to Fix

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the "solquest" project
3. Go to "Settings" > "Environment Variables"
4. Delete the existing MONGODB_URI and MONGODB_URI_PROD variables
5. Add them again with the correct connection string:

   | Name | Value | Environment |
   |------|-------|-------------|
   | MONGODB_URI | mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0 | Production |
   | MONGODB_URI_PROD | mongodb+srv://solquest-admin:PU49hcZfaCuZnboa@cluster0.ou2xdtu.mongodb.net/solquest?retryWrites=true&w=majority&appName=Cluster0 | Production |

6. Make sure to double-check that the hostname includes `ou2xdtu` in it
7. Click "Save" after adding each variable
8. After updating the variables, redeploy your backend by running:
   ```
   vercel --prod
   ```

## Verify the Fix
After redeploying, run the test script again to verify the connection:
```
node test-deployed-backend.js
```
