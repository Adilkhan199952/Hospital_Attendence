# 🚀 Vercel Deployment Guide - Hospital Attendance System

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **MongoDB Atlas**: Database should be accessible from anywhere (0.0.0.0/0)

## 🎯 Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `https://github.com/Adilkhan199952/Hospital_Attendence`
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://hospital-attendence-2.onrender.com/api
   ```

5. Click **Deploy**

#### Step 2: Deploy Backend (Optional - Currently on Render)

Your backend is already deployed on Render at:
```
https://hospital-attendence-2.onrender.com
```

If you want to deploy backend to Vercel:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the same GitHub repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `Backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

4. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://adilkhan08780_db_user:Akhan114@hospital.t8vav8n.mongodb.net/
   JWT_SECRET=supersecretkey123
   NODE_ENV=production
   ```

5. Click **Deploy**

6. After deployment, update frontend environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

### Option 2: Deploy via Vercel CLI

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy Frontend
```bash
cd frontend
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **hospital-attendance-frontend**
- Directory? **./frontend**
- Override settings? **N**

#### Deploy Backend
```bash
cd Backend
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **hospital-attendance-backend**
- Directory? **./Backend**
- Override settings? **N**

## 🔧 Environment Variables Setup

### Frontend Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://hospital-attendence-2.onrender.com/api` | Production |

### Backend Environment Variables (if deploying to Vercel)

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGO_URI` | Your MongoDB connection string | Production |
| `JWT_SECRET` | Your secret key | Production |
| `NODE_ENV` | `production` | Production |

## 🌐 Custom Domain Setup (Optional)

1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. Wait for DNS propagation (5-30 minutes)

## ✅ Post-Deployment Checklist

### Frontend Verification
- [ ] Visit your Vercel URL
- [ ] Check if login page loads correctly
- [ ] Verify no console errors
- [ ] Test login with demo credentials
- [ ] Check if API calls work

### Backend Verification (if deployed to Vercel)
- [ ] Visit `https://your-backend-url.vercel.app/health`
- [ ] Should return: `{"status":"OK",...}`
- [ ] Test API endpoint: `https://your-backend-url.vercel.app/api/auth/login`

### CORS Configuration
If you deployed backend to Vercel, update `Backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://your-frontend-url.vercel.app",
    "https://hospital-attendence-2.onrender.com"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or pull requests

## 📊 Monitoring & Analytics

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View **Build Logs** and **Function Logs**

### Performance Monitoring
- Vercel provides built-in analytics
- Check **Analytics** tab in your project
- Monitor response times and errors

## 🐛 Troubleshooting

### Issue: Blank Screen After Deployment

**Solution:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check if API is accessible from browser
4. Verify CORS settings on backend

### Issue: API Calls Failing

**Solution:**
1. Check if backend is running: Visit `/health` endpoint
2. Verify environment variables are set
3. Check CORS configuration
4. Verify MongoDB connection string

### Issue: Build Fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

### Issue: 404 on Page Refresh

**Solution:**
- Already handled by `vercel.json` routing configuration
- All routes redirect to `index.html` for client-side routing

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret key
3. **MongoDB**: Restrict IP access in production
4. **HTTPS**: Vercel provides automatic HTTPS
5. **CORS**: Only allow trusted domains

## 📱 Testing Your Deployment

### Test Login
```
Email: admin@hospital.com
Password: admin123
```

### Test API Endpoints
```bash
# Health check
curl https://your-backend-url.vercel.app/health

# Login test
curl -X POST https://your-backend-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123"}'
```

## 🎉 Success!

Your Hospital Attendance System is now live on Vercel!

### Frontend URL
```
https://your-project-name.vercel.app
```

### Backend URL (if deployed to Vercel)
```
https://your-backend-name.vercel.app
```

### Current Setup
- **Frontend**: Ready for Vercel deployment
- **Backend**: Already deployed on Render
- **Database**: MongoDB Atlas

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment variables
4. Test API endpoints manually
5. Check MongoDB connection

---

**Note**: Your backend is currently deployed on Render (`https://hospital-attendence-2.onrender.com`). You can keep it there or migrate to Vercel. Both options work perfectly!
