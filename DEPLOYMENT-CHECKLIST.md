# 🚀 Quick Deployment Checklist

## Pre-Deployment Setup

### 1. MongoDB Atlas (5 minutes)
- [ ] Create account at mongodb.com/cloud/atlas
- [ ] Create free cluster
- [ ] Create database user (save credentials!)
- [ ] Allow access from anywhere (0.0.0.0/0)
- [ ] Copy connection string

### 2. Cloudinary (Already Done ✅)
- [ ] You already have Cloudinary configured
- [ ] Have your credentials ready

---

## Backend Deployment (Render) - 10 minutes

### 1. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your repository
5. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2. Add Environment Variables
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<random_string_min_32_chars>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
CORS_ORIGIN=*
```

3. Click **Create Web Service**
4. Wait for deployment
5. **Copy your backend URL**: `https://your-app.onrender.com`

---

## Frontend Deployment (Netlify) - 5 minutes

### 1. Create .env.production
Create file in project root:
```env
VITE_API_URL=https://your-app.onrender.com/api
```
(Use your actual Render URL)

### 2. Deploy to Netlify
1. Go to [netlify.com](https://www.netlify.com)
2. Sign up with GitHub
3. Click **Add new site** → **Import project**
4. Select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Add environment variable:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://your-app.onrender.com/api`

6. Click **Deploy site**
7. **Copy your frontend URL**: `https://your-app.netlify.app`

---

## Final Configuration - 2 minutes

### Update CORS on Render
1. Go to Render dashboard
2. Select your web service
3. Go to **Environment**
4. Update `CORS_ORIGIN`:
```
CORS_ORIGIN=https://your-app.netlify.app
```
5. Save (triggers redeploy)

---

## Seed Admin User - 2 minutes

### On Your Local Machine
```bash
# Update server/.env with production MongoDB URI temporarily
MONGODB_URI=<your_production_mongodb_uri>

# Run seed script
cd server
node seedAdmin.js

# Revert .env back to local URI
```

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Change password immediately after first login!**

---

## Test Everything - 5 minutes

### Backend Test
Visit: `https://your-app.onrender.com`
Should see: "API is running..."

### Frontend Test
Visit: `https://your-app.netlify.app`
- [ ] Homepage loads
- [ ] Dark mode works
- [ ] Contact form works
- [ ] Admin login works
- [ ] All pages load correctly

---

## 🎉 You're Live!

**Your URLs:**
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-app.onrender.com`
- Admin: `https://your-app.netlify.app/admin/login`

**Total Time: ~25 minutes**

---

## 📝 Important Notes

### Render Free Tier
- ⚠️ Server spins down after 15 min of inactivity
- ⚠️ First request after sleep takes ~30 seconds (cold start)
- ✅ Upgrade to paid tier ($7/month) to avoid this

### Auto-Deploy
- ✅ Both Netlify and Render auto-deploy on git push
- ✅ Push to `main` branch to trigger deployment

### Custom Domain (Optional)
- Add custom domain in Netlify/Render settings
- Update DNS records
- Free SSL certificate included!

---

## 🆘 Quick Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_API_URL` in Netlify environment variables
- Verify backend is running on Render

**CORS errors:**
- Update `CORS_ORIGIN` on Render to match Netlify URL
- Wait for Render to redeploy

**Database connection fails:**
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify connection string is correct

**Admin login doesn't work:**
- Make sure you ran `seedAdmin.js` with production database
- Check backend logs on Render

---

## 📚 Full Documentation

For detailed step-by-step instructions, see the [Deployment Guide](file:///C:/Users/rooba/.gemini/antigravity/brain/df119388-d89f-4502-ac08-0360506180e2/deployment-guide.md)

---

**Need help?** Check the troubleshooting section in the full deployment guide!
