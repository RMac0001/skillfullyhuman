import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { getCollection } from '@lib/db/mongo';
import type { User, UserCreateInput, UserUpdateInput } from '@ftypes/user';

const COLLECTION = 'users';

// --- Zod Schemas ---

// Full User object (used for parsing from DB)
export const UserSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  email: z.string().email(),
  name: z.string().min(2),
  image: z.string().url().optional(),
  role: z.enum(['user', 'admin']),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for incoming POST / create
export const UserCreateSchema = UserSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update (PATCH / PUT)
export const UserUpdateSchema = UserCreateSchema.partial();

// --- Timestamp helper ---
function withTimestamps<T extends object>(
  data: T,
): T & { createdAt: Date; updatedAt: Date } {
  const now = new Date();
  return { ...data, createdAt: now, updatedAt: now };
}

// --- User Model ---
export const UserModel = {
  async create(userData: UserCreateInput): Promise<User> {
    UserCreateSchema.parse(userData);

    const user: User = withTimestamps(userData);

    const collection = await getCollection<User>(COLLECTION);
    const result = await collection.insertOne(user);

    return { ...user, _id: result.insertedId };
  },

  async findById(id: string | ObjectId): Promise<User | null> {
    const collection = await getCollection<User>(COLLECTION);
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  },

  async findByEmail(email: string): Promise<User | null> {
    const collection = await getCollection<User>(COLLECTION);
    return collection.findOne({ email });
  },

  async update(
    id: string | ObjectId,
    userData: UserUpdateInput,
  ): Promise<User | null> {
    UserUpdateSchema.parse(userData);

    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const collection = await getCollection<User>(COLLECTION);

    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: objectId }, { $set: updateData });

    return this.findById(objectId);
  },

  async delete(id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const collection = await getCollection<User>(COLLECTION);
    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  },
};
