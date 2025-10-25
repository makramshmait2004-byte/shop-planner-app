import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.js';
import shoppingRoutes from './routes/shopping.js';
import familyRoutes from './routes/families.js';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/families', familyRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      message: 'FamList Backend is running with database!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    environment: process.env.NODE_ENV,
    database: 'Connected to Supabase PostgreSQL'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FamList Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected to Supabase' : 'Not configured'}`);
});