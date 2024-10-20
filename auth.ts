import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUser } from './app/lib/user';
import { hashPassword } from './app/lib/cryptography';
import { User } from './app/types';

 
export const { auth, signIn, signOut , handlers} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const verifyPassword = (storedHashedPassword: string, salt: string, inputPassword: string) => hashPassword(inputPassword, salt) === storedHashedPassword;
          const isValidPassword = verifyPassword(user.hashedPassword, user.salt, password);
          if (isValidPassword) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;

        if (user.metadata) {
          token.metadata = user.metadata; // Add onboarding answers
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.name = token.name as User['name'];
        session.user.email = token.email as User['email'];
        session.user.metadata = token.metadata as User['metadata'];
      }
      return session;
    },
  },
});