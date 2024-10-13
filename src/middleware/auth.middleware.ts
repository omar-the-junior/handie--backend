import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    userType: string;
    email: string;
  };
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
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

        const decoded = jwt.verify(token, secret) as {
          userId: string;
          userType: string;
          email: string;
        };

        req.user = decoded;
        next();
      } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(401).json({ error: 'Invalid token' });
      }
    }
  }
};

export default authMiddleware;
