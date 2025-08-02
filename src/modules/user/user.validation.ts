import { z } from 'zod';
import { USER_ROLE } from './user.constant';

// Validation schema for user registration
export const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name should be at least 2 characters long'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.SENDER, USER_ROLE.RECEIVER]),
});

// Validation schema for user login
export const userLoginSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(6, 'Password is required'),
});

// Validation schema for updating user info (partial)
export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phoneNumber: z.string().min(10).optional(),
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.SENDER, USER_ROLE.RECEIVER]).optional(),
  isBlocked: z.boolean().optional(),
});
