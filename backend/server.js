import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server and direct calls
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'ShopSphere E-Commerce API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404 handler for unknown API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Serve Frontend static production build on port 5000 as well
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.redirect('http://localhost:5173');
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred'
  });
});

// Start Server and Initialize Database
const startServer = async () => {
  try {
    await initDatabase();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`🚀 ShopSphere Backend running on http://localhost:${PORT}`);
        console.log(`📦 REST API Health: http://localhost:${PORT}/api/health`);
        console.log(`======================================================\n`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export { app };

