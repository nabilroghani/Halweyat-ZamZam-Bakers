import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import { sampleProducts, sampleCategories } from './data/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/halwiyat_zamzam';

// Global In-Memory Fallback State (Active if MongoDB service is offline)
export let inMemoryDB = {
  products: [...sampleProducts.map((p, idx) => ({ ...p, _id: `p-${idx + 1}` }))],
  categories: [...sampleCategories.map((c, idx) => ({ ...c, _id: `c-${idx + 1}` }))],
  orders: [],
  contacts: [],
  users: [
    { _id: 'u-1', name: 'Zamzam Owner Admin', email: 'admin@zamzam.com', passwordHash: 'admin123', role: 'admin' },
    { _id: 'u-2', name: 'Timergara Counter Staff', email: 'reception@zamzam.com', passwordHash: 'reception123', role: 'receptionist' }
  ]
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    brand: 'Halwiyat Zamzam Bakers Timergara', 
    version: '2.0.0',
    dbConnected: mongoose.connection.readyState === 1,
    time: new Date() 
  });
});

// Connect DB & Start Server
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log('✅ Connected to MongoDB database successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Halwiyat Zamzam Bakers API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection offline. Server running in Standalone Fallback Mode.', err.message);
    app.listen(PORT, () => {
      console.log(`🚀 Halwiyat Zamzam Bakers API running on http://localhost:${PORT} (Standalone Mode)`);
    });
  });
