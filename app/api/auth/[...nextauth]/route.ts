// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@lib/db/mongo';
import crypto from 'crypto';

// Verify password function
function verifyPassword(
  storedPassword: string,
  suppliedPassword: string,
): boolean {
  const [salt, hash] = storedPassword.split(':');
  const suppliedHash = crypto
    .pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === suppliedHash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        console.log('🔐 AUTH ATTEMPT', credentials);

        try {
          const { db } = await connectToDatabase();

          const user = await db.collection('users').findOne({
            email: credentials.email,
          });

          console.log('📧 User found:', !!user); // Check if user exists

          if (!user) {
            console.log('❌ No user found with email:', credentials.email);
            return null;
          }

          console.log(
            '🔑 Password hash format:',
            user.passwordHash?.substring(0, 20) + '...',
          ); // Check format

          const isPasswordValid = verifyPassword(
            user.passwordHash,
            credentials.password,
          );

          console.log('✅ Password valid:', isPasswordValid); // Check result

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role as 'admin' | 'user',
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// THIS IS THE KEY CHANGE - App Router requires this syntax
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
