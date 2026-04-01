import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/client.js';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import incomeRoutes from './routes/incomes.js';
import residentRoutes from './routes/residents.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Initialize database
initializeDatabase().then(success => {
  if (!success) {
    console.error('Failed to initialize database');
    process.exit(1);
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Core CRUD routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/residents', residentRoutes);

// Protected route example
app.get('/api/protected', authenticateToken, (req: any, res: Response) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`🚀 Backend server is running on port ${port}`);
  console.log(`📍 API: http://localhost:${port}`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET /api/auth/me (protected)`);
  console.log(`💰 Expenses endpoints:`);
  console.log(`   POST /api/expenses (create with shares)`);
  console.log(`   GET /api/expenses (list all)`);
  console.log(`   GET /api/expenses/:id (get one with shares)`);
  console.log(`   PUT /api/expenses/:id (update)`);
  console.log(`   DELETE /api/expenses/:id (delete)`);
  console.log(`📊 Incomes endpoints:`);
  console.log(`   POST /api/incomes (create)`);
  console.log(`   GET /api/incomes (list all)`);
  console.log(`   GET /api/incomes/:id (get one)`);
  console.log(`   PUT /api/incomes/:id (update)`);
  console.log(`   DELETE /api/incomes/:id (delete)`);
  console.log(`👥 Residents endpoints:`);
  console.log(`   POST /api/residents (create)`);
  console.log(`   GET /api/residents (list all)`);
  console.log(`   GET /api/residents/:id (get one)`);
  console.log(`   PUT /api/residents/:id (update)`);
  console.log(`   DELETE /api/residents/:id (delete)`);
});

export default app;
