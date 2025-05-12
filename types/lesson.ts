// File: types/lesson.ts
import { ObjectId } from 'mongodb';
import { User } from './user';

export interface Lesson {
  _id?: ObjectId;
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  published: boolean;
  author: User | string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  prerequisites?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface LessonCreateInput {
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  prerequisites?: string[];
}

export type LessonUpdateInput = Partial<
  Omit<Lesson, '_id' | 'createdAt' | 'updatedAt'>
>;
