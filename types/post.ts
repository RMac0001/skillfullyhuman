// File: types/post.ts
import { User } from './user';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  author: User | string;
  tags: string[];
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface PostCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  tags?: string[];
}

export interface PostUpdateInput extends Partial<PostCreateInput> {
  slug?: string;
}
