# Vercel Environment Variables

## Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### REACT_APP_API_URL
**IMPORTANT: Must include `/api` at the end!**

```
REACT_APP_API_URL=https://hospital-attendence-2.onrender.com/api
```

⚠️ **Common Mistake:** Setting it to `https://hospital-attendence-2.onrender.com` (without `/api`)

✅ **Correct:** `https://hospital-attendence-2.onrender.com/api` (with `/api`)

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Click **Add New**
5. Enter:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://hospital-attendence-2.onrender.com/api`
   - **Environments**: Select Production (and Preview if needed)
6. Click **Save**
7. Go to **Deployments** tab
8. Click the three dots on the latest deployment
9. Click **Redeploy**

## Verify Environment Variable

After deployment, check the browser console. You should see:
```
API Base URL: https://hospital-attendence-2.onrender.com/api
```

If you see:
```
API Base URL: https://hospital-attendence-2.onrender.com
```

Then the environment variable is missing the `/api` suffix.

## Testing the API Connection

Open browser console and run:
```javascript
console.log(process.env.REACT_APP_API_URL);
```

Or check the Network tab when logging in - the request should go to:
```
https://hospital-attendence-2.onrender.com/api/auth/login
```

NOT:
```
https://hospital-attendence-2.onrender.com/auth/login  ❌
```

## Troubleshooting

### Issue: 404 Not Found on API calls
**Cause:** Environment variable doesn't include `/api`
**Solution:** Update `REACT_APP_API_URL` to include `/api` at the end

### Issue: Environment variable not updating
**Cause:** Vercel caches environment variables
**Solution:** 
1. Update the environment variable
2. Trigger a new deployment (not just redeploy)
3. Or clear Vercel cache and redeploy

### Issue: Works locally but not on Vercel
**Cause:** Local `.env` file has correct value, but Vercel doesn't
**Solution:** Ensure Vercel environment variables match your local `.env.production`

## Backend API Endpoints

All API endpoints are prefixed with `/api`:

- `/api/auth/login` - Login
- `/api/auth/register` - Register
- `/api/users` - User management
- `/api/attendance` - Attendance operations

## Current Backend URL

The backend is deployed on Render:
```
https://hospital-attendence-2.onrender.com
```

API Base URL (with /api prefix):
```
https://hospital-attendence-2.onrender.com/api
```

Health check endpoint:
```
https://hospital-attendence-2.onrender.com/health
```
