import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import alertRoutes from './routes/alerts.js';
import transactionRoutes from './routes/transactions.js';
import emailVerificationRoutes from './routes/emailVerification.js';
import twoFactorRoutes from './routes/twoFactor.js';
import searchRoutes from './routes/search.js';
import reportsRoutes from './routes/reports.js';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const httpServer = createServer(app);

// Configure CORS for production and development
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL // Vercel URL
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/verify', emailVerificationRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  socket.on('subscribe_coin', (coinId) => {
    socket.join(`coin:${coinId}`);
    console.log(`Client ${socket.id} subscribed to coin: ${coinId}`);
  });
  
  socket.on('unsubscribe_coin', (coinId) => {
    socket.leave(`coin:${coinId}`);
    console.log(`Client ${socket.id} unsubscribed from coin: ${coinId}`);
  });
});

// Store io instance globally for use in other files
global.io = io;

// Simulate real-time price updates (in production, this would come from a real crypto API)
setInterval(async () => {
  try {
    // This is a simulation - in production, you'd fetch real prices from an API
    // For now, we'll emit random price fluctuations
    const coins = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana'];
    
    for (const coin of coins) {
      const priceChange = (Math.random() - 0.5) * 2; // -1% to +1% change
      io.to(`coin:${coin}`).emit('price_update', {
        coinId: coin,
        change: priceChange,
        timestamp: Date.now()
      });
    }
    
    // Emit general market update
    io.emit('market_update', {
      timestamp: Date.now(),
      message: 'Market data updated'
    });
  } catch (error) {
    console.error('Error broadcasting price updates:', error);
  }
}, 10000); // Update every 10 seconds

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
