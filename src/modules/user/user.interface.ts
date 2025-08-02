// D:\yeamin student\Programming hero level 2\Assignment5\src\modules\user\user.interface.ts

export type UserRole = 'ADMIN' | 'SENDER' | 'RECEIVER';

export enum IsBlocked {
  BLOCKED = 'BLOCKED',
  UNBLOCKED = 'UNBLOCKED',
}

export interface IUser {
  _id?: string;             // MongoDB ID as string
  email: string;
  name: string;
  phoneNumber: string;
  password?: string;        // optional when returning user data (e.g., responses)
  role: UserRole;
  isBlocked?: IsBlocked;
  createdAt?: Date;
  updatedAt?: Date;
}
