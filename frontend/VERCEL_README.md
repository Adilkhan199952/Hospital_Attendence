# 🚀 Frontend Vercel Deployment

## Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Adilkhan199952/Hospital_Attendence&project-name=hospital-attendance&root-directory=frontend&env=REACT_APP_API_URL&envDescription=Backend%20API%20URL&envLink=https://github.com/Adilkhan199952/Hospital_Attendence)

## Manual Deployment Steps

### 1. Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repository: `https://github.com/Adilkhan199952/Hospital_Attendence`
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. Environment Variables:
   ```
   REACT_APP_API_URL=https://hospital-attendence-2.onrender.com/api
   ```

5. Click **Deploy**

### 2. Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy to production
vercel --prod
```

## Environment Variables

Required environment variables for production:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://hospital-attendence-2.onrender.com/api` | Backend API endpoint |

Optional variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `GENERATE_SOURCEMAP` | `false` | Disable source maps in production |
| `INLINE_RUNTIME_CHUNK` | `false` | Optimize bundle size |

## Build Configuration

The project uses:
- **Framework**: Create React App
- **Node Version**: 14.x or higher
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Vercel Configuration

The `vercel.json` file is already configured with:
- Static build setup
- SPA routing (all routes → index.html)
- Static asset handling
- Environment variables

## Post-Deployment

After deployment:

1. **Test the application**:
   - Visit your Vercel URL
   - Try logging in with demo credentials
   - Check browser console for errors

2. **Verify API connectivity**:
   - Open browser DevTools → Network tab
   - Login and check API calls
   - Ensure calls go to correct backend URL

3. **Demo Credentials**:
   ```
   Admin: admin@hospital.com / admin123
   Staff: sarah@hospital.com / staff123
   ```

## Troubleshooting

### Blank Screen
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Check if backend is accessible

### API Errors
- Verify backend CORS settings allow your Vercel domain
- Check backend is running: `https://hospital-attendence-2.onrender.com/health`
- Verify environment variables in Vercel dashboard

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

## Custom Domain

To add a custom domain:

1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Wait for DNS propagation

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Support

For issues:
1. Check Vercel deployment logs
2. Review browser console
3. Verify environment variables
4. Test API endpoints

---

**Current Status**: ✅ Vercel Ready
