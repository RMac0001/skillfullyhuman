// File: types/session.ts
import { User } from './user';

export interface Session {
  id: string;
  title?: string;
  user: User | string;
  content: string[];
  summary?: string;
  status: 'active' | 'completed' | 'archived';
  duration?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface SessionCreateInput {
  title?: string;
  user: string;
  content?: string[];
  status?: 'active' | 'completed' | 'archived';
}

export interface SessionUpdateInput extends Partial<SessionCreateInput> {
  summary?: string;
  duration?: number;
  completedAt?: Date;
}
