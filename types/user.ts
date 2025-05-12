// types/user.ts
import { ObjectId } from 'mongodb';

// Define the role type as a union for better type checking
export type UserRole = 'user' | 'admin';

// Your existing User interface
export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  image?: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreateInput = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type UserUpdateInput = Partial<
  Omit<User, '_id' | 'createdAt' | 'updatedAt'>
>;

// Create a type that represents the user data stored in the JWT token and session
// Typically you don't want to expose passwordHash in the token/session
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: UserRole;
};
