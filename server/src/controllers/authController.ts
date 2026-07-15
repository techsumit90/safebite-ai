import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // token validity

// Helper to generate JWT
const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });
};

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

// Register new user (email/password)
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
  message: parsed.error.issues[0].message,
});
    }
    const { email, password, name } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    const token = generateToken(user);
    // Set httpOnly cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

// Login existing user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
  message: parsed.error.issues[0].message,
});
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

// Logout – clear cookie
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
};

// Get current authenticated user profile
export const getMe = (req: Request, res: Response) => {
  // req.user is populated by auth middleware (passport)
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  // Expose selected fields only
  return res.json({ id: user._id, email: user.email, name: user.name, healthProfile: user.healthProfile });
};

// Update current user's health profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    const { healthProfile } = req.body;
    if (!healthProfile) {
      return res.status(400).json({ message: 'Missing healthProfile data' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { healthProfile } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        healthProfile: updatedUser.healthProfile,
      }
    });
  } catch (err) {
    next(err);
  }
};
