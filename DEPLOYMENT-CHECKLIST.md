# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

- [ ] All code committed and pushed to GitHub
- [ ] MongoDB Atlas account created
- [ ] MongoDB Atlas database created
- [ ] MongoDB Atlas IP whitelist configured (0.0.0.0/0 for all IPs)
- [ ] Cloudinary account created and credentials ready
- [ ] Strong JWT secret generated

## Backend Deployment (Render)

- [ ] Render account created
- [ ] New Web Service created on Render
- [ ] Repository connected to Render
- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] NODE_ENV=production
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
  - [ ] PORT=5000
- [ ] Backend deployed successfully
- [ ] Backend URL noted: `_______________________________`
- [ ] Test endpoint: `https://your-backend.onrender.com/api/home`

## Frontend Deployment (Vercel)

- [ ] Vercel account created
- [ ] `.env.production` updated with backend URL
- [ ] New project created on Vercel
- [ ] Repository connected to Vercel
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL=https://your-backend.onrender.com/api
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `_______________________________`

## Post-Deployment Configuration

- [ ] Backend CORS updated with Vercel URL
- [ ] Backend redeployed after CORS update
- [ ] Admin user seeded in production database
- [ ] Test login functionality
- [ ] Test all CRUD operations
- [ ] Test image uploads (Cloudinary)
- [ ] Test contact form
- [ ] Verify all pages load correctly

## Testing

- [ ] Homepage loads
- [ ] About page loads
- [ ] Projects page loads
- [ ] Blog page loads
- [ ] Services page loads
- [ ] Contact page loads
- [ ] Resume page loads
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Can create/edit/delete content
- [ ] Images upload successfully
- [ ] Contact form sends messages
- [ ] All API endpoints working

## Optional Enhancements

- [ ] Custom domain configured on Vercel
- [ ] Custom domain configured on Render
- [ ] SSL certificates verified
- [ ] Analytics set up (Google Analytics, Vercel Analytics)
- [ ] Error monitoring set up (Sentry)
- [ ] Performance monitoring enabled
- [ ] SEO optimization verified
- [ ] Social media meta tags working

## Production URLs

**Frontend**: `_______________________________`

**Backend**: `_______________________________`

**Admin Panel**: `_______________________________/admin`

## Important Notes

1. **Render Free Tier**: Services sleep after 15 minutes of inactivity. First request may take 30-60 seconds.

2. **Environment Variables**: Any changes to environment variables require a redeploy.

3. **MongoDB Atlas**: Ensure IP whitelist is set to `0.0.0.0/0` or add Render's specific IPs.

4. **CORS**: Make sure backend CORS includes your Vercel domain.

5. **Cloudinary**: Verify upload preset is set to "unsigned" or configure signed uploads.

## Troubleshooting

If something doesn't work:

1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoints directly using Postman/Thunder Client
5. Check MongoDB Atlas connection
6. Verify CORS configuration
7. Clear browser cache and try again

## Maintenance

- [ ] Set up automatic deployments from GitHub
- [ ] Configure branch protection rules
- [ ] Set up staging environment (optional)
- [ ] Document deployment process for team
- [ ] Set up backup strategy for database
- [ ] Monitor application performance
- [ ] Set up uptime monitoring

---

**Deployment Date**: `_______________`

**Deployed By**: `_______________`

**Notes**: 
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```
