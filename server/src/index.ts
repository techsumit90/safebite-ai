import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import expressWinston from 'express-winston';
import passport from './config/passport';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import scansRouter from './routes/scans';
import rootRouter from './routes/root';
import dbConnect from './config/db';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is missing from environment variables');
  process.exit(1);
}

if (!process.env.CLIENT_URL) {
  console.error('❌ FATAL: CLIENT_URL is missing from environment variables');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('❌ FATAL: MONGO_URI is missing from environment variables');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ FATAL: GEMINI_API_KEY is missing from environment variables');
  process.exit(1);
}

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
