# MongoDB Migration - Setup Guide

## 🔄 Migration Complete!

Firebase has been successfully removed and replaced with MongoDB + Express backend.

---

## 📋 What Changed

### **Removed:**
- ❌ Firebase SDK (`firebase` package)
- ❌ Firebase Authentication
- ❌ Firestore Database
- ❌ `/src/firebase` directory

### **Added:**
- ✅ Express.js backend server
- ✅ MongoDB with Mongoose ODM
- ✅ JWT-based authentication
- ✅ RESTful API endpoints
- ✅ Backend dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)

---

## 🚀 Setup Instructions

### **1. Install Dependencies**

```bash
npm install
```

This will install all frontend and backend dependencies.

---

### **2. Set Up MongoDB**

#### **Option A: Local MongoDB**
1. Install MongoDB on your machine
2. Start MongoDB service:
   ```bash
   mongod
   ```

#### **Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Whitelist your IP address

---

### **3. Configure Environment Variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cryptox
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cryptox

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**⚠️ Important:** Generate a secure JWT_SECRET. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### **4. Update Vite Config (Optional)**

If you want to proxy API calls during development, update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🏃 Running the Application

### **Option 1: Run Both Servers Concurrently**

```bash
npm run dev:all
```

This runs both frontend (Vite) and backend (Express) servers simultaneously.

### **Option 2: Run Separately**

**Terminal 1 - Backend:**
```bash
npm run server
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🔐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth token)

### **Portfolio**
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio` - Add coin to portfolio
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

### **Price Alerts**
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Add price alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

---

## 🔧 Code Changes

### **Frontend Changes:**

1. **AuthContext** (`src/context/AuthContext.jsx`)
   - Now uses axios to call backend API
   - JWT token stored in localStorage
   - Token sent in Authorization header

2. **Portfolio** (`src/pages/Portfolio.jsx`)
   - Fetches portfolio from MongoDB via API
   - Real-time CRUD operations

3. **PriceAlerts** (`src/components/PriceAlerts.jsx`)
   - Fetches alerts from MongoDB via API
   - Updates alert status in database

4. **New File:** `src/services/userApi.js`
   - Centralized API calls for portfolio and alerts

### **Backend Structure:**

```
server/
├── index.js              # Express server entry point
├── config/
│   └── db.js            # MongoDB connection
├── models/
│   └── User.js          # User schema (includes portfolio & alerts)
├── middleware/
│   └── auth.js          # JWT authentication middleware
└── routes/
    ├── auth.js          # Authentication routes
    ├── portfolio.js     # Portfolio CRUD routes
    └── alerts.js        # Alerts CRUD routes
```

---

## 🗄️ Database Schema

### **User Model:**

```javascript
{
  username: String,
  email: String,
  password: String (hashed with bcrypt),
  portfolio: [
    {
      coinId: String,
      amount: Number,
      purchasePrice: Number,
      purchaseDate: String
    }
  ],
  alerts: [
    {
      coinId: String,
      targetPrice: Number,
      condition: String ('above' | 'below'),
      triggered: Boolean,
      createdAt: Date
    }
  ],
  timestamps: true (createdAt, updatedAt)
}
```

---

## 🔒 Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens for stateless authentication
- ✅ Protected routes with middleware
- ✅ CORS enabled for frontend communication
- ✅ MongoDB injection protection via Mongoose

---

## 🐛 Troubleshooting

### **"Cannot connect to MongoDB"**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas: Verify IP whitelist and credentials

### **"401 Not authorized"**
- Check if token is being sent in requests
- Verify JWT_SECRET matches between requests
- Try logging in again to get fresh token

### **"Port 5000 already in use"**
- Change `PORT` in `.env` file
- Kill existing process: `npx kill-port 5000`

### **Frontend can't reach backend**
- Ensure backend is running on port 5000
- Check `API_URL` in frontend files (should be `http://localhost:5000/api`)
- Verify CORS is enabled in backend

---

## 📦 Package Scripts

```json
{
  "dev": "vite",                    // Run frontend only
  "server": "node server/index.js", // Run backend only
  "dev:all": "concurrently ...",    // Run both servers
  "build": "vite build",            // Build for production
  "preview": "vite preview"         // Preview production build
}
```

---

## 🚀 Deployment Notes

### **Backend Deployment (Render, Heroku, Railway):**
1. Set environment variables on hosting platform
2. Ensure MongoDB Atlas connection string is used
3. Update frontend `API_URL` to production URL

### **Frontend Deployment (Vercel, Netlify):**
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Update `API_URL` in code to point to production backend

---

## ✨ Benefits of Migration

1. **Full Control:** Own your database and user data
2. **No Vendor Lock-in:** Not tied to Firebase ecosystem
3. **Cost Effective:** MongoDB free tier is generous
4. **Flexibility:** Easy to add custom backend logic
5. **Scalability:** MongoDB handles large datasets well
6. **RESTful API:** Standard approach, easy to integrate

---

## 📝 Next Steps

1. ✅ Install dependencies
2. ✅ Set up MongoDB (local or Atlas)
3. ✅ Configure `.env` file
4. ✅ Run the application
5. ✅ Test authentication (register/login)
6. ✅ Test portfolio management
7. ✅ Test price alerts

---

## 💡 Tips

- Use MongoDB Compass to visualize your database
- Keep JWT_SECRET secure and never commit it
- Consider adding rate limiting for production
- Add input validation with express-validator
- Implement refresh tokens for better security
- Add logging with winston or morgan

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check network tab in browser DevTools for API calls

---

**Happy Coding! 🎉**
