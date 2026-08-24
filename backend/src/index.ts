import express from 'express';
import cors from 'cors';
import { env } from './config/environment';
import { testConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import queryRoutes from './routes/queryRoutes';
import historyRoutes from './routes/historyRoutes';
import type { ApiResponse } from './types';

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://queryai-bice.vercel.app'
  ],
  credentials: true,
}));

// --- Routes ---

app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (_req, res) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);

  const response: ApiResponse<null> = {
    success: false,
    error: env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  };
  
  res.status(500).json(response);
});

// --- Start Server ---

async function start(): Promise<void> {
  // Test database connection before accepting requests
  await testConnection();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
