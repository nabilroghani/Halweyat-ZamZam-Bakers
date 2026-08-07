import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setIO } from './socketInstance.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO Real-Time Server
let io = null;
if (!process.env.VERCEL) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  });
  setIO(io);
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);
  });
} else {
  setIO(null);
}

// Import routes AFTER io is initialized
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import bannerRoutes from './routes/banners.js';
import { sampleProducts, sampleCategories } from './data/seedData.js';

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

// Serverless DB Connection Caching
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) return;

  if (process.env.VERCEL && (!process.env.MONGO_URI || process.env.MONGO_URI.includes('127.0.0.1') || process.env.MONGO_URI.includes('localhost'))) {
    console.log('⚡ Vercel Serverless: Using Standalone In-Memory DB Mode');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    isConnected = true;
    console.log('✅ Connected to MongoDB database successfully.');
  } catch (err) {
    console.warn('⚠️ MongoDB connection offline. Server running in Standalone Fallback Mode.', err.message);
  }
}

// Database Connection Middleware for Serverless Invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/banners', bannerRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    brand: 'Halwiyat Zamzam Bakers Timergara', 
    version: '2.2.0',
    dbConnected: mongoose.connection.readyState === 1,
    socketConnections: io?.engine?.clientsCount || 0,
    isServerless: Boolean(process.env.VERCEL),
    time: new Date() 
  });
});

// Root API Handler
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Halwiyat Zamzam Bakers Timergara API',
    version: '2.2.0',
    healthCheck: '/api/health'
  });
});

// Connect DB & Start Local Server (Only when not in Vercel Serverless environment)
if (!process.env.VERCEL) {
  connectDB().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Halwiyat Zamzam Bakers API running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO real-time server active on ws://localhost:${PORT}`);
    });
  });
}

export default app;

