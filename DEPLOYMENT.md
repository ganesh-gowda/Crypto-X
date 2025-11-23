# CryptoX Deployment Guide

## 🚀 Deployment Overview
- **Frontend:** Vercel (React + Vite)
- **Backend:** Render (Node.js + Express)
- **Database:** MongoDB Atlas (already configured)

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com
4. **MongoDB Atlas** - Already configured ✅

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Prepare Backend
Your backend is ready! The `server/` folder has everything needed.

### Step 2: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Crypto-X`
4. Configure the service:
   - **Name:** `cryptox-backend` (or your choice)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (for now)

### Step 3: Add Environment Variables in Render

Click **"Environment"** tab and add these variables:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=5000
```

**Important Notes:**
- Get `MONGO_URI` from MongoDB Atlas Dashboard
- Generate a strong `JWT_SECRET` (use a password generator)
- For Gmail: Enable 2FA and create an App Password
- You'll update `FRONTEND_URL` after deploying frontend

### Step 4: Deploy
Click **"Create Web Service"** and wait for deployment (~5 minutes)

**Your backend URL will be:** `https://cryptox-backend-xxxx.onrender.com`

⚠️ **Copy this URL!** You'll need it for frontend deployment.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update API URLs in Frontend

First, let's update your frontend to use environment variables:

1. Open `src/services/api.js` (or wherever you have axios instances)
2. Replace hardcoded `http://localhost:5000` with:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

### Step 2: Update .env.production

Edit `f:\PROJECTS\Crypto\Crypto-X\.env.production`:
```env
VITE_API_URL=https://your-backend-name.onrender.com
```
Replace with your actual Render backend URL from Part 1.

### Step 3: Commit Changes

```bash
git add .
git commit -m "chore: Add production deployment configuration"
git push origin main
```

### Step 4: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Crypto-X`
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-name.onrender.com` (your Render URL)

6. Click **"Deploy"**

Wait ~2-3 minutes for deployment.

**Your frontend URL will be:** `https://cryptox-xxxx.vercel.app`

### Step 5: Update Backend FRONTEND_URL

1. Go back to Render Dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` with your Vercel URL: `https://cryptox-xxxx.vercel.app`
5. Save changes (this will trigger a redeploy)

---

## ✅ Part 3: Verify Deployment

### Test Your Live App:

1. Visit your Vercel URL: `https://cryptox-xxxx.vercel.app`
2. Try signing up for a new account
3. Check if email verification works
4. Add some transactions
5. Test portfolio analytics
6. Try price alerts

### Common Issues & Fixes:

**Issue: CORS errors**
- Solution: Make sure `FRONTEND_URL` is set correctly in Render

**Issue: API calls failing**
- Check Render logs: Dashboard → Your Service → Logs
- Verify `VITE_API_URL` is set in Vercel

**Issue: MongoDB connection failed**
- Verify `MONGO_URI` in Render environment variables
- Check MongoDB Atlas → Network Access → Allow all IPs (0.0.0.0/0)

**Issue: Email not sending**
- Verify Gmail App Password is correct
- Check spam folder

---

## 🎯 Post-Deployment Steps

### 1. Update API URLs in Code

Find and replace all instances of `http://localhost:5000` in your frontend:

```bash
# Search for hardcoded URLs
grep -r "localhost:5000" src/
```

Replace with:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 2. Add Custom Domain (Optional)

**Vercel:**
- Dashboard → Your Project → Settings → Domains
- Add your custom domain (e.g., cryptox.com)

**Render:**
- Dashboard → Your Service → Settings → Custom Domain
- Add your backend subdomain (e.g., api.cryptox.com)

### 3. Monitor Your App

**Vercel Analytics:**
- Dashboard → Your Project → Analytics (free)

**Render Metrics:**
- Dashboard → Your Service → Metrics

---

## 🔄 Continuous Deployment

Both platforms support **auto-deployment**:

- **Push to GitHub `main` branch** → Automatic deployment to both Vercel & Render
- No manual steps needed after initial setup!

---

## 💰 Free Tier Limits

**Vercel (Free):**
- 100 GB bandwidth/month
- Unlimited projects
- Automatic HTTPS

**Render (Free):**
- 750 hours/month
- Spins down after 15 mins of inactivity
- ⚠️ Cold starts (~30 seconds to wake up)

**MongoDB Atlas (Free - M0):**
- 512 MB storage
- Shared RAM
- Good for ~10K users

---

## 🚨 Important Security Notes

1. **Never commit `.env` files** (already in `.gitignore` ✅)
2. **Use strong JWT secrets** (64+ random characters)
3. **Enable MongoDB IP whitelist** in production
4. **Set up rate limiting** on backend APIs
5. **Enable Vercel password protection** during development

---

## 📞 Need Help?

**Vercel Docs:** https://vercel.com/docs
**Render Docs:** https://render.com/docs

---

## ✨ Your Deployed URLs

Once deployed, save these:

```
Frontend: https://cryptox-xxxx.vercel.app
Backend:  https://cryptox-backend-xxxx.onrender.com/api
```

**Congratulations! Your CryptoX app is now live! 🎉**
