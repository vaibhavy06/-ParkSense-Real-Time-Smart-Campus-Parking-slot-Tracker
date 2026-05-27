import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { initSocket } from './services/socket';
import { initCronJobs } from './utils/cron';
import { startSimulation } from './simulation/simulator';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

// Enable CORS with credentials support (necessary for httpOnly cookies)
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
  res.send('ParkSense API is running in real-time...');
});

// Bind Unified API Router
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error.' });
});

// Initialize Background services
initCronJobs();
startSimulation();

// Start Server
httpServer.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` ParkSense Real-Time Server running on port ${PORT} `);
  console.log(`====================================================`);
});
