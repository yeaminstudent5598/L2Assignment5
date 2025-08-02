// D:\yeamin student\Programming hero level 2\Assignment5\src\modules\user\user.interface.ts

export type UserRole = 'ADMIN' | 'SENDER' | 'RECEIVER';

export enum IsBlocked {
  BLOCKED = 'BLOCKED',
  UNBLOCKED = 'UNBLOCKED',
}

export interface IUser {
  _id?: string;            
  email: string;
  name: string;
  phoneNumber: string;
  password?: string;       
  role: UserRole;
  isBlocked?: IsBlocked;
  createdAt?: Date;
  updatedAt?: Date;
}
