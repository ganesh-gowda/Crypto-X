# ✅ Post-Migration Checklist

Use this checklist to ensure everything is set up correctly after the migration.

---

## 📦 Step 1: Install Dependencies

```bash
cd f:/PROJECTS/Crypto/Crypto-X
npm install
```

**Verify:**
- [ ] No errors during installation
- [ ] `node_modules` folder created
- [ ] New packages installed (express, mongoose, bcryptjs, etc.)

---

## 🗄️ Step 2: Set Up MongoDB

Choose your preferred method:

### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer
   - Choose "Complete" installation

2. **Start MongoDB Service:**
   
   **Windows:**
   ```bash
   net start MongoDB
   ```
   Or run MongoDB Compass (GUI tool included)

   **Mac:**
   ```bash
   brew services start mongodb-community
   ```

   **Linux:**
   ```bash
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is Running:**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   ```

**Checklist:**
- [ ] MongoDB installed
- [ ] MongoDB service running
- [ ] Can connect via `mongosh`

### Option B: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster:**
   - Click "Create Cluster"
   - Choose "Free" tier (M0)
   - Select a region close to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Set Up Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Set Up Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

**Checklist:**
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied

---

## 🔐 Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   
   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/cryptox
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptox
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Generate Secure JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste as `JWT_SECRET`

**Checklist:**
- [ ] `.env` file created
- [ ] `MONGODB_URI` set correctly
- [ ] `JWT_SECRET` generated and set
- [ ] `PORT` set to 5000
- [ ] File saved

---

## 🚀 Step 4: Test Backend Server

1. **Start the backend:**
   ```bash
   npm run server
   ```

2. **You should see:**
   ```
   Server running on port 5000
   MongoDB Connected: localhost (or your Atlas cluster)
   ```

3. **Test health endpoint:**
   Open browser or use curl:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

**Checklist:**
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health endpoint returns OK
- [ ] No error messages in console

---

## 🎨 Step 5: Test Frontend

1. **Open new terminal (keep backend running)**

2. **Start frontend:**
   ```bash
   npm run dev
   ```

3. **You should see:**
   ```
   VITE v4.4.5  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open browser:**
   - Navigate to `http://localhost:5173`
   - Homepage should load

**Checklist:**
- [ ] Vite server starts without errors
- [ ] Homepage loads correctly
- [ ] No console errors in browser
- [ ] Navbar appears
- [ ] Trending coins display

---

## 🔑 Step 6: Test Authentication

1. **Register a new user:**
   - Click "Sign Up"
   - Enter username: `testuser`
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Confirm password
   - Click "Sign Up"

2. **Verify registration:**
   - Should redirect to Portfolio page
   - Username appears in navbar
   - No errors in console

3. **Test logout:**
   - Click on username in navbar
   - Click "Logout"
   - Should redirect to home page

4. **Test login:**
   - Click "Login"
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Login"
   - Should redirect to Portfolio

**Checklist:**
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can logout
- [ ] Username displays in navbar
- [ ] Token stored in localStorage
- [ ] Protected routes work

---

## 💼 Step 7: Test Portfolio Management

1. **Add a coin to portfolio:**
   - Go to Portfolio page
   - Click "Add Coin"
   - Select a coin (e.g., Bitcoin)
   - Enter amount: `0.1`
   - Enter purchase price: `50000`
   - Select purchase date
   - Click "Add Coin"

2. **Verify portfolio item:**
   - Item appears in portfolio table
   - Values calculated correctly
   - Profit/loss displayed

3. **Edit portfolio item:**
   - Click edit icon
   - Change amount to `0.2`
   - Click "Save Changes"
   - Verify changes reflected

4. **Delete portfolio item:**
   - Click delete icon
   - Item removed from table

**Checklist:**
- [ ] Can add coins to portfolio
- [ ] Portfolio items display correctly
- [ ] Can edit portfolio items
- [ ] Can delete portfolio items
- [ ] Total value calculates correctly
- [ ] Data persists on page refresh

---

## 🔔 Step 8: Test Price Alerts

1. **Add a price alert:**
   - Scroll to "Price Alerts" section
   - Click "Add Alert"
   - Select a coin
   - Enter target price
   - Select condition (above/below)
   - Click "Add"

2. **Verify alert:**
   - Alert appears in table
   - Status shows "Pending"
   - Current price displayed

3. **Delete alert:**
   - Click delete icon
   - Alert removed

**Checklist:**
- [ ] Can add price alerts
- [ ] Alerts display correctly
- [ ] Can delete alerts
- [ ] Status updates correctly
- [ ] Data persists on page refresh

---

## 🗃️ Step 9: Verify Database

### For Local MongoDB:
```bash
mongosh
use cryptox
db.users.find().pretty()
```

### For MongoDB Atlas:
1. Go to Atlas dashboard
2. Click "Browse Collections"
3. Select "cryptox" database
4. View "users" collection

**Verify:**
- [ ] User document exists
- [ ] Password is hashed (not plain text)
- [ ] Portfolio array contains items
- [ ] Alerts array contains items
- [ ] createdAt and updatedAt timestamps

---

## 🧪 Step 10: Test All Features

Go through the entire app:

**Home Page:**
- [ ] Trending cryptocurrencies load
- [ ] Prices display correctly
- [ ] Links work

**Market Page:**
- [ ] Top 100 cryptocurrencies load
- [ ] Pagination works
- [ ] Currency selector works

**Coin Detail Page:**
- [ ] Coin details load
- [ ] Charts render
- [ ] Timeframe selector works

**News Page:**
- [ ] News articles load
- [ ] Filters work
- [ ] Refresh button works

**Portfolio Page:**
- [ ] All CRUD operations work
- [ ] Charts display
- [ ] Performance metrics correct

---

## 🔧 Step 11: Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill process
npx kill-port 5000

# Or change port in .env
PORT=5001
```

### Issue: "401 Not authorized"

**Solution:**
- Check if token is in localStorage
- Try logging out and back in
- Verify JWT_SECRET is same in .env
- Check Authorization header in network tab

### Issue: "Unexpected token in JSON"

**Solution:**
- Check backend is running
- Verify API_URL in frontend code
- Check for CORS issues in console

---

## 📊 Step 12: Performance Check

Open browser DevTools (F12):

**Network Tab:**
- [ ] API calls return quickly (<100ms local)
- [ ] No 404 or 500 errors
- [ ] JWT token sent in requests

**Console Tab:**
- [ ] No errors
- [ ] No warnings (or only minor ones)

**Application Tab:**
- [ ] localStorage contains 'token'
- [ ] localStorage contains 'user'

---

## 🎉 Final Verification

If all checkboxes are ✅, congratulations! Your migration is complete.

### Quick Test Script:

Run this to test all API endpoints:

```bash
# Test health
curl http://localhost:5000/api/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","email":"test2@example.com","password":"password123"}'

# Test login (copy token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"password123"}'

# Test portfolio (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Notes

- Keep both terminals open (backend + frontend)
- Backend must be running for frontend to work
- Check console for any errors
- MongoDB must be running before starting backend

---

## 🆘 Need Help?

1. Check `MONGODB_SETUP.md` for detailed setup
2. Check `MIGRATION_SUMMARY.md` for what changed
3. Check `ARCHITECTURE.md` for understanding the new structure
4. Review console logs for specific errors
5. Verify all environment variables are set

---

## ✅ All Done!

Once all steps are complete:
- [ ] Backend runs successfully
- [ ] Frontend runs successfully
- [ ] Authentication works
- [ ] Portfolio management works
- [ ] Price alerts work
- [ ] Data persists in MongoDB
- [ ] No console errors

**Your CryptoX app is now fully migrated to MongoDB! 🎉**

---

**Next Steps:**
- Explore the code
- Add new features
- Deploy to production
- Share with others

**Happy Coding! 🚀**
