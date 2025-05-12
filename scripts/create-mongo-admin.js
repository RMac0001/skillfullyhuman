import { connectToDatabase } from '@lib/db/mongo.js';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

async function promptQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  try {
    const adminData = {
      name: await promptQuestion('Enter admin name: '),
      email: await promptQuestion('Enter admin email: '),
      password: await promptQuestion('Enter admin password (min 8 chars): '),
    };

    // Validate input
    try {
      adminSchema.parse(adminData);
    } catch (error) {
      console.error('Validation error:', error.errors);
      return;
    }

    // Hash password
    const hashedPassword = await hash(adminData.password, 12);

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({
      email: adminData.email,
    });

    if (existingAdmin) {
      console.log('Admin with this email already exists!');
      return;
    }

    // Insert new admin
    await db.collection('admins').insertOne({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log('Admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

createAdmin();
