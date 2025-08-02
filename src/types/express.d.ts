import { Request } from 'express';
import { UserRole } from '../modules/user/user.interface';

interface AuthUser {
  id: string;
  email?: string;
  role: UserRole;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}
