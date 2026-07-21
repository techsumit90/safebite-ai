import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnv = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'CLIENT_URL', 'GEMINI_API_KEY'];
const missingEnv = requiredEnv.filter((v) => !process.env[v]);
if (missingEnv.length > 0) {
  console.error(`❌ FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

// Check for placeholder keys
const geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey === 'your_gemini_api_key' || geminiKey === 'your_gemini_api_key_here') {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is configured with a placeholder value. AI analysis will fall back to local analysis.');
}

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import expressWinston from 'express-winston';
import passport from './config/passport';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import scansRouter from './routes/scans';
import rootRouter from './routes/root';
import dbConnect from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Winston Logger setup
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Database connection
dbConnect();

// Routes
app.use('/', rootRouter);
app.use('/api/auth', authRouter);
app.use('/api', healthRouter);
app.use('/api/scans', scansRouter);

// Global Error Handler and Winston error logger
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
