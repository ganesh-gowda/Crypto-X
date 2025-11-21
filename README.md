# CryptoX# CryptoX



A modern cryptocurrency tracking application built with React, Vite, Express.js, and MongoDB.A modern cryptocurrency tracking application built with React and Vite.



## ✨ Features## Features



- 🔐 **User Authentication** - Secure JWT-based authentication with MongoDB- Real-time cryptocurrency price tracking

- 📊 **Real-time Cryptocurrency Tracking** - Live prices from CoinGecko API  - Top 100 cryptocurrencies listing

- 💼 **Portfolio Management** - Track your crypto investments and performance- Exchange information

- 🔔 **Price Alerts** - Set alerts for target prices with browser notifications- Latest crypto news

- 📰 **Crypto News** - Latest cryptocurrency news feed- Responsive design for all devices

- 💱 **Multi-currency Support** - USD, EUR, GBP, JPY, INR

- 📈 **Interactive Charts** - Visualize price history with Chart.js## Technologies Used

- 🎨 **Responsive Design** - Mobile-friendly interface with Tailwind CSS

- React

## 🛠️ Technologies Used- Vite

- Tailwind CSS

### Frontend- Axios for API requests

- ⚛️ React 18- React Router for navigation

- 🚀 Vite

- 🎨 Tailwind CSS## Getting Started

- 🔄 React Router

- 📊 Chart.js & React-ChartJS-21. Clone the repository

- 📡 Axios2. Install dependencies:


### Backend
- 🚂 Express.js
- 🗄️ MongoDB with Mongoose
- 🔒 JWT Authentication
- 🛡️ Bcrypt for password hashing
- 🌐 CORS enabled

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ganesh-gowda/Crypto-X.git
cd Crypto-X
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your machine
- Start MongoDB service: `mongod`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string

### 4. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/cryptox
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
NODE_ENV=development
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run the application

#### Option A: Run both servers together (Recommended)
```bash
npm run dev:all
```

#### Option B: Run servers separately

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

### 6. Open your browser
Navigate to `http://localhost:5173`

## ⚡ Quick Start Scripts

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

## 📦 Available Scripts

```bash
npm run dev        # Run frontend only
npm run server     # Run backend only
npm run dev:all    # Run both frontend and backend
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Portfolio
- `GET /api/portfolio` - Get user portfolio (protected)
- `POST /api/portfolio` - Add coin to portfolio (protected)
- `PUT /api/portfolio/:id` - Update portfolio item (protected)
- `DELETE /api/portfolio/:id` - Delete portfolio item (protected)

### Price Alerts
- `GET /api/alerts` - Get user alerts (protected)
- `POST /api/alerts` - Add price alert (protected)
- `PUT /api/alerts/:id` - Update alert (protected)
- `DELETE /api/alerts/:id` - Delete alert (protected)

## 📁 Project Structure

```
Crypto-X/
├── server/                 # Backend (Express + MongoDB)
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── index.js           # Server entry point
├── src/                   # Frontend (React)
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── context/          # React Context
│   ├── services/         # API services
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utility functions
├── public/               # Static assets
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
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
      condition: 'above' | 'below',
      triggered: Boolean,
      createdAt: Date
    }
  ],
  timestamps: true
}
```

## 🔒 Security Features

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for stateless authentication
- ✅ Protected routes with middleware
- ✅ CORS enabled
- ✅ MongoDB injection protection via Mongoose
- ✅ Environment variables for sensitive data

## 🐛 Troubleshooting

### Cannot connect to MongoDB
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas: Verify IP whitelist and credentials

### 401 Not authorized
- Check if token is being sent in requests
- Try logging in again to get a fresh token

### Port 5000 already in use
- Change `PORT` in `.env` file
- Or kill the process: `npx kill-port 5000`

## 📚 Documentation

For detailed setup instructions and migration guide, see:
- [MongoDB Setup Guide](./MONGODB_SETUP.md)

## 🚀 Deployment

### Backend (Render, Heroku, Railway)
1. Set environment variables on hosting platform
2. Use MongoDB Atlas connection string
3. Update frontend `API_URL` to production URL

### Frontend (Vercel, Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set `API_URL` environment variable

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Ganesh Gowda**
- GitHub: [@ganesh-gowda](https://github.com/ganesh-gowda)

## 🙏 Acknowledgments

- CoinGecko API for cryptocurrency data
- CryptoCompare API for news
- All contributors and users of this project

---

**Happy Crypto Tracking! 🚀📈**
