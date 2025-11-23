# Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### Backend (Render)
- [ ] `server/` folder has all necessary files
- [ ] `server/package.json` has `start` script
- [ ] Environment variables documented in `.env.production`
- [ ] MongoDB Atlas configured with correct connection string
- [ ] CORS configuration updated in `server/index.js`

### Frontend (Vercel)
- [ ] `vercel.json` configuration file created
- [ ] `.env.production` file created
- [ ] All hardcoded API URLs updated to use `apiConfig.js`
- [ ] Build command set to `npm run build`
- [ ] Output directory set to `dist`

### Git Repository
- [ ] All changes committed
- [ ] `.env` files in `.gitignore`
- [ ] Pushed to GitHub

---

## 🚀 Deployment Steps (Quick Version)

### 1. Deploy Backend to Render (5 min)
```
1. Go to render.com → New Web Service
2. Connect GitHub repo: Crypto-X
3. Root Directory: server
4. Build: npm install
5. Start: npm start
6. Add environment variables (see DEPLOYMENT.md)
7. Deploy!
```

**Copy your backend URL:** `https://your-backend.onrender.com`

### 2. Update Frontend Environment Variable
```
Edit .env.production:
VITE_API_URL=https://your-backend.onrender.com
```

### 3. Commit and Push
```powershell
git add .
git commit -m "chore: Configure production deployment"
git push origin main
```

### 4. Deploy Frontend to Vercel (3 min)
```
1. Go to vercel.com → New Project
2. Import GitHub repo: Crypto-X
3. Framework: Vite
4. Build: npm run build
5. Output: dist
6. Add env variable: VITE_API_URL=https://your-backend.onrender.com
7. Deploy!
```

**Copy your frontend URL:** `https://your-app.vercel.app`

### 5. Update Backend FRONTEND_URL
```
1. Go to Render → Your Service → Environment
2. Update FRONTEND_URL: https://your-app.vercel.app
3. Save (triggers redeploy)
```

### 6. Test Your Live App! 🎉
Visit: `https://your-app.vercel.app`

---

## ⚠️ Important Files Created

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment configuration |
| `.env.production` | Frontend production env variables |
| `server/.env.production` | Backend production env template |
| `src/config/apiConfig.js` | Centralized API URL configuration |
| `DEPLOYMENT.md` | Full deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | This checklist |

---

## 🔧 Environment Variables Needed

### Render (Backend)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_random_secret
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=5000
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Quick Troubleshooting

**CORS Error?**
- Check FRONTEND_URL in Render matches your Vercel URL exactly

**API Not Working?**
- Check Render logs for errors
- Verify VITE_API_URL in Vercel settings

**MongoDB Connection Failed?**
- Check MONGO_URI in Render
- Verify MongoDB Atlas → Network Access → Allow All IPs (0.0.0.0/0)

**Email Not Sending?**
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail first

---

## 📱 Test After Deployment

- [ ] Sign up new account
- [ ] Verify email works
- [ ] Log in successfully
- [ ] Add transactions
- [ ] View portfolio
- [ ] Check analytics page
- [ ] Test price alerts
- [ ] Export reports (PDF/CSV)
- [ ] Test search functionality

---

## 🎯 Your Deployment URLs

Fill these in after deployment:

```
Frontend: https://_________________________.vercel.app
Backend:  https://_________________________.onrender.com
MongoDB:  mongodb+srv://________________________
```

---

**Need detailed help?** See `DEPLOYMENT.md` for full guide!

**Estimated Total Time:** 15-20 minutes for both deployments
