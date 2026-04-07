# Deployment Guide

This guide will help you deploy your portfolio application with the frontend on Vercel and the backend on Render.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- MongoDB Atlas account (for production database)

---

## Part 1: Deploy Backend on Render

### Step 1: Prepare Your Repository

1. Make sure all your code is committed to GitHub
2. Push your latest changes:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create a New Web Service on Render

1. Go to https://dashboard.render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `bsgportfolio-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### Step 3: Set Environment Variables on Render

Add the following environment variables in Render dashboard:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

**Important Notes:**
- Use MongoDB Atlas for production database (not local MongoDB)
- Generate a strong JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Get Cloudinary credentials from https://cloudinary.com/console

### Step 4: Deploy Backend

1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your backend URL (e.g., `https://bsgportfolio-backend.onrender.com`)

### Step 5: Test Backend

Visit `https://your-backend-url.onrender.com/api/home` to verify it's working.

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Update Production Environment Variables

Your `.env.production` file should have:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render backend URL.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables on Vercel

In Vercel project settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Make sure to set it for "Production" environment.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

---

## Part 3: Configure Backend CORS

Update your backend to allow requests from your Vercel domain.

In `server/index.js`, update the CORS configuration:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-project.vercel.app',
  'https://your-custom-domain.com' // if you have a custom domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commit and push this change - Render will automatically redeploy.

---

## Part 4: Seed Production Database

After backend is deployed, seed your admin user:

1. SSH into Render (or use Render Shell):
   ```bash
   node seedAdmin.js
   ```

2. Or run it locally pointing to production:
   - Temporarily update `server/.env` with production MongoDB URI
   - Run: `cd server && node seedAdmin.js`
   - Revert the `.env` changes

---

## Part 5: Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render (Backend):
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

---

## Troubleshooting

### Backend Issues:

1. **500 Error**: Check Render logs for errors
2. **Database Connection Failed**: Verify MongoDB URI and whitelist Render's IP (0.0.0.0/0 for all IPs)
3. **Environment Variables**: Double-check all env vars are set correctly

### Frontend Issues:

1. **API Calls Failing**: Verify `VITE_API_URL` is correct
2. **CORS Errors**: Update backend CORS configuration
3. **Build Fails**: Check build logs in Vercel dashboard

### Common Issues:

1. **Render Free Tier Sleep**: Free tier services sleep after 15 minutes of inactivity. First request may be slow.
2. **Environment Variables**: Remember to rebuild/redeploy after changing env vars
3. **MongoDB Atlas**: Ensure IP whitelist includes `0.0.0.0/0` or Render's IPs

---

## Monitoring & Maintenance

### Render:
- Monitor logs in Render dashboard
- Set up health checks
- Consider upgrading to paid plan for better performance

### Vercel:
- Monitor analytics in Vercel dashboard
- Set up custom domain
- Configure automatic deployments from GitHub

---

## Deployment Checklist

- [ ] Backend deployed on Render
- [ ] All environment variables set on Render
- [ ] MongoDB Atlas configured and accessible
- [ ] Backend URL noted
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on Vercel
- [ ] CORS configured on backend
- [ ] Admin user seeded in production database
- [ ] Test all features on production
- [ ] Custom domains configured (optional)

---

## Quick Commands Reference

```bash
# Deploy to Vercel
vercel --prod

# Check Vercel deployment status
vercel ls

# View Vercel logs
vercel logs

# Redeploy Render (push to GitHub)
git push origin main
```

---

## Support

If you encounter issues:
1. Check Render logs: https://dashboard.render.com
2. Check Vercel logs: https://vercel.com/dashboard
3. Verify all environment variables
4. Test API endpoints directly
5. Check MongoDB Atlas connection

---

## Production URLs

After deployment, update these in your documentation:

- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-backend.onrender.com
- **API Base**: https://your-backend.onrender.com/api

---

Good luck with your deployment! 🚀
