import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { type NextAuthOptions } from 'next-auth';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      return Promise.resolve(`${baseUrl}`);
    },
  },
  theme: {
    colorScheme: 'dark', // "auto" | "dark" | "light"
    brandColor: '#bbff00', // Hex color code
    buttonText: '#ff00ff', // Hex color code
  },
  logger: {
    error: message => console.error(message),
    debug: message => console.debug(message),
    warn: message => console.warn(message),
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
