// scripts/create-admin.ts
// Description: Creates an admin user in the database
// Args: none

import dotenv from 'dotenv-safe';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  example: path.resolve(process.cwd(), '.env.template'),
});

import { connectToDatabase } from '../lib/db/mongo';
import { z } from 'zod';
import readline from 'readline';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { UserRole } from '../types/user';

// Ensure outputs directory exists
const outputsDir = path.join(process.cwd(), 'outputs');
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

const logFile = path.join(outputsDir, 'admin-creation.log');

interface AdminInputData {
  name: string;
  email: string;
  password: string;
}

interface AdminDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminCreationResult {
  success: boolean;
  timestamp: string;
  adminData?: {
    name: string;
    email: string;
    role: string;
    id: string;
  };
  error?: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Validation schema
const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),
});

function writeLog(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}`;

  console.log(logEntry);
  fs.appendFileSync(logFile, logEntry + '\n');
}

function saveResult(result: AdminCreationResult): void {
  const resultFile = path.join(outputsDir, `admin-creation-${Date.now()}.json`);
  fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
  writeLog(`Result saved to: ${resultFile}`);
}

// Helper function to prompt for input
async function promptQuestion(
  question: string,
  isPassword: boolean = false,
): Promise<string> {
  return new Promise(resolve => {
    if (isPassword) {
      // Hide password input
      const stdin = process.stdin;
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      process.stdout.write(question);
      let password = '';

      const onData = (chunk: Buffer) => {
        const char = chunk.toString('utf8');

        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener('data', onData);
            process.stdout.write('\n');
            resolve(password);
            break;
          case '\u0003':
            process.exit();
            break;
          case '\u007f': // backspace
            if (password.length > 0) {
              password = password.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            password += char;
            process.stdout.write('*');
            break;
        }
      };

      stdin.on('data', onData);
    } else {
      rl.question(question, answer => {
        resolve(answer.trim());
      });
    }
  });
}

// Enhanced password hashing with more security
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512') // 100000 iterations
    .toString('hex');
  return `${salt}:${hash}`;
}

// Verify password function (for future use)
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(':');
  const testHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return testHash === storedHash;
}

async function createAdmin(): Promise<void> {
  const startTime = new Date().toISOString();
  writeLog('Starting admin creation process');

  let result: AdminCreationResult = {
    success: false,
    timestamp: startTime,
  };

  try {
    writeLog(`MongoDB Database: ${process.env.MONGODB_NAME}`);

    // Collect admin data
    console.log('\n📝 Creating Admin User');
    console.log('='.repeat(30));

    const adminData: AdminInputData = {
      name: await promptQuestion('👤 Enter admin name: '),
      email: await promptQuestion('📧 Enter admin email: '),
      password: await promptQuestion(
        '🔒 Enter admin password (min 8 chars, must include uppercase, lowercase, and number): ',
        true,
      ),
    };

    // Validate input
    writeLog('Validating input data');
    try {
      adminSchema.parse(adminData);
      writeLog('Input validation passed');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map(e => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        writeLog(`Validation failed: ${errorMessages}`);
        console.error('\n❌ Validation errors:');
        error.errors.forEach(e => {
          console.error(`  • ${e.path.join('.')}: ${e.message}`);
        });
        result.error = errorMessages;
        saveResult(result);
        return;
      } else {
        writeLog(`Validation error: ${error}`);
        result.error = String(error);
        saveResult(result);
        return;
      }
    }

    // Hash password
    writeLog('Hashing password');
    const passwordHash = hashPassword(adminData.password);

    // Connect to database
    writeLog('Connecting to database');
    const { db } = await connectToDatabase();
    writeLog('Database connection established');

    // Check if admin already exists
    writeLog(`Checking for existing admin with email: ${adminData.email}`);
    const existingAdmin = await db.collection('users').findOne({
      email: adminData.email,
    });

    if (existingAdmin) {
      const message = `Admin with email ${adminData.email} already exists!`;
      writeLog(message);
      console.log(`\n⚠️  ${message}`);
      result.error = message;
      saveResult(result);
      return;
    }

    // Create admin document
    const adminDoc: AdminDocument = {
      name: adminData.name,
      email: adminData.email,
      passwordHash: passwordHash,
      role: 'admin' as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert new admin
    writeLog('Creating admin user in database');
    const insertResult = await db.collection('users').insertOne(adminDoc);

    if (insertResult.acknowledged) {
      writeLog(
        `Admin created successfully with ID: ${insertResult.insertedId}`,
      );

      console.log('\n✅ Admin created successfully!');
      console.log('='.repeat(30));
      console.log(`👤 Name: ${adminDoc.name}`);
      console.log(`📧 Email: ${adminDoc.email}`);
      console.log(`🔐 Role: ${adminDoc.role}`);
      console.log(`🆔 ID: ${insertResult.insertedId}`);
      console.log(`📅 Created: ${adminDoc.createdAt.toISOString()}`);

      result = {
        success: true,
        timestamp: startTime,
        adminData: {
          name: adminDoc.name,
          email: adminDoc.email,
          role: adminDoc.role,
          id: insertResult.insertedId.toString(),
        },
      };
    } else {
      throw new Error('Failed to insert admin into database');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    writeLog(`Error creating admin: ${errorMessage}`);
    console.error('\n❌ Error creating admin:', errorMessage);
    result.error = errorMessage;
  } finally {
    saveResult(result);
    rl.close();
    writeLog('Admin creation process completed');

    setTimeout(() => {
      process.exit(result.success ? 0 : 1);
    }, 100);
  }
}

// Run the function
if (require.main === module) {
  createAdmin().catch(error => {
    writeLog(`Fatal error: ${error}`);
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}
