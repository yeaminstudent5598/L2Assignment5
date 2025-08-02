// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/user/user.model';
import { envVars } from '../config/env';
import { verifyToken } from '../utils/jwt';
import AppError from '../errorHelpers/AppError';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET!) as JwtPayload;
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId);
    console.log('User from DB:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.isBlocked) {
      console.log('User is blocked');
      return res.status(403).json({ message: 'User is blocked' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
