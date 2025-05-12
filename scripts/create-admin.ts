// scripts/create-admin.ts
import { connectToDatabase } from '../lib/db/mongo';
import { z } from 'zod';
import readline from 'readline';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { UserRole } from '../types/user';

// Define the input data structure
interface AdminInputData {
  name: string;
  email: string;
  password: string;
}

// Define the admin document structure for MongoDB
interface AdminDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Validation schema
const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Helper function to prompt for input
async function promptQuestion(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Hash password with crypto
function hashPassword(password: string): string {
  // Generate a salt
  const salt = crypto.randomBytes(16).toString('hex');
  // Hash the password with the salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  // Return salt + hash
  return `${salt}:${hash}`;
}

// Main function to create an admin user
async function createAdmin(): Promise<void> {
  try {
    console.log('MONGODB_NAME:', process.env.MONGODB_NAME);
    // Collect admin data
    const adminData: AdminInputData = {
      name: await promptQuestion('Enter admin name: '),
      email: await promptQuestion('Enter admin email: '),
      password: await promptQuestion('Enter admin password (min 8 chars): '),
    };

    // Validate input
    try {
      adminSchema.parse(adminData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Validation error:', error);
      }
      return;
    }

    // Hash password
    const passwordHash = hashPassword(adminData.password);

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({
      email: adminData.email,
    });

    if (existingAdmin) {
      console.log('Admin with this email already exists!');
      return;
    }

    // Create admin document
    const adminDoc: AdminDocument = {
      name: adminData.name,
      email: adminData.email,
      passwordHash: passwordHash,
      role: 'admin' as UserRole, // Cast to UserRole type
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert new admin
    await db.collection('users').insertOne(adminDoc);

    console.log('Admin created successfully!');
    console.log(`Name: ${adminDoc.name}`);
    console.log(`Email: ${adminDoc.email}`);
    console.log(`Role: ${adminDoc.role}`);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the function
createAdmin().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
