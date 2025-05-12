// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../../lib/db/mongo';
import crypto from 'crypto';

// Verify password function
function verifyPassword(
  storedPassword: string,
  suppliedPassword: string,
): boolean {
  // Implement according to how your passwords are stored
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

        try {
          const { db } = await connectToDatabase();

          // Find user
          const user = await db.collection('users').findOne({
            email: credentials.email,
          });

          if (!user) {
            return null;
          }

          // Check password
          const isPasswordValid = verifyPassword(
            user.passwordHash,
            credentials.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return user data
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
    maxAge: 24 * 60 * 60, // 24 hours
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

// Export the NextAuth handler for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
