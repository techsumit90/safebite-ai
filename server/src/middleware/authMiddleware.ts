import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Middleware to protect routes using JWT authentication
export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  // passport.authenticate returns a function; we call it manually
  const auth = passport.authenticate('jwt', { session: false });
  auth(req, res, next);
};
