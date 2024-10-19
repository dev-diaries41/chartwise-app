'use server'
import crypto from 'crypto'
import { FindOneAndUpdateResponse,AddDocResponse, NewUser, OnboardingAnswers, User } from "@/app/types";
import { findOneAndUpdateDoc } from "./mongo/update";
import { hashPassword } from '@/app/lib/cryptography';
import dbConnect from '@/app/lib/db';
import { getDoc } from '@/app/lib/mongo/get';
import { addDoc } from '@/app/lib/mongo/add';
import UserModel from '@/app/models/user';


export async function findUser(email: string){
  const result =  await getDoc(UserModel, {email})
  if(!result.success || !result.data) return null;
  return result.data;
}

export async function getUser(email: string): Promise<User | undefined> {
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

export async function completedOnboarding(email: string, answers:OnboardingAnswers): Promise<FindOneAndUpdateResponse<User>> {
  await dbConnect()
    const filter = { email };
    const update = {
      'metadata.answers': answers,
      'metadata.hasCompletedOnboarding': true,
    };
  
    return await findOneAndUpdateDoc<User>(UserModel, filter, update);
  }