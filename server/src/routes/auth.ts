import { Router } from 'express';
import passport from '../config/passport';
import { register, login, logout, getMe, updateProfile } from '../controllers/authController';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes – requires JWT auth
router.get('/me', passport.authenticate('jwt', { session: false }), getMe);
router.put('/profile', passport.authenticate('jwt', { session: false }), updateProfile);

export default router;
