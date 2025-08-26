// D:\yeamin student\Programming hero level 2\Assignment5\src\middlewares\authMiddleware.ts

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

    // 1. টোকেন হেডার আছে কি না এবং সঠিক ফরম্যাটে আছে কি না তা চেক করা
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized: No token provided or invalid format');
    }

    // 2. "Bearer " অংশটি বাদ দিয়ে আসল টোকেনটি আলাদা করা
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'Unauthorized: Token is missing');
    }

    // 3. আসল টোকেনটি ভেরিফাই করা
    const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.isBlocked) {
      throw new AppError(403, 'Forbidden: User is blocked');
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    // এররটি `next` এর মাধ্যমে এরর হ্যান্ডলিং মিডলওয়্যারে পাঠানো ভালো অভ্যাস
    next(error);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new AppError(401, 'Unauthorized: User role not found'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden: You do not have permission to perform this action'));
    }

    next();
  };
};