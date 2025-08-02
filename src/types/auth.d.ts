// src/interfaces/auth.d.ts

export type UserRole = 'ADMIN' | 'SENDER' | 'RECEIVER';

export interface AuthUser {
  id: string;
  role: UserRole;
}
