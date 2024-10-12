import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { AddDocResponse, NewUser, User } from '@/app/types';
import { hashPassword } from './app/lib/cryptography';
import dbConnect from './app/lib/db';
import { getDoc } from './app/lib/mongo/get';
import UserModel from '@/app/models/user';
import { addDoc } from './app/lib/mongo/add';
import crypto from 'crypto'

export async function findUser(email: string){
  const result =  await getDoc(UserModel, {email})
  if(!result.success || !result.data) return null;
  return result.data;
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    await dbConnect();
    const user = await findUser(email);
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function signUp(newUser: NewUser): Promise<AddDocResponse> {
  await dbConnect();
  const {password, ...userInfo} = newUser;
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt)
  const user: User = {...userInfo, hashedPassword, salt};
  return addDoc(UserModel, user);
}

 
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
});