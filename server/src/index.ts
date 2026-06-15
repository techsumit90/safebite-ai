import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from './config/passport';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import scansRouter from './routes/scans';
import rootRouter from './routes/root';
import dbConnect from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Database connection
dbConnect();

// Routes
app.use('/', rootRouter);
app.use('/api/auth', authRouter);
app.use('/api', healthRouter);
app.use('/api/scans', scansRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
