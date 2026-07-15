import { Router } from 'express';
import passport from '../config/passport';
import { register, login, logout, getMe, updateProfile } from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: { message: 'Too many requests, please try again later.' }
});

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

// Protected routes – requires JWT auth
router.get('/me', passport.authenticate('jwt', { session: false }), getMe);
router.put('/profile', passport.authenticate('jwt', { session: false }), updateProfile);

export default router;
