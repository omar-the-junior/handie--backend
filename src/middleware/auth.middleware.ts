import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { CustomJwtPayload } from '../utils/jwt.utils.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
  } else {
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token missing' });
    } else {
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, secret) as CustomJwtPayload;

        req.user = {
          userId: decoded.userId,
          userType: decoded.userType,
          email: decoded.email,
        };
        next();
      } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(401).json({ error: 'Invalid token' });
      }
    }
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
    } else if (!roles.includes(req.user.userType)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    } else {
      next();
    }
  };
};

export default authMiddleware;
