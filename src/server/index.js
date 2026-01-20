import express from 'express';
import cors from 'cors';
import authRoutes from './authRoutes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);

// Check if dist folder exists (for combined frontend/backend deployment)
const distPath = path.join(__dirname, '../../dist');
if (fs.existsSync(distPath)) {
  // Serve static files from React app
  app.use(express.static(distPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // API-only mode - just return a simple response for non-API routes
  app.get('/', (req, res) => {
    res.json({ message: 'Crypto-X API is running', status: 'ok' });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});