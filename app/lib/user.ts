'use server'
import crypto from 'crypto'
import { FindOneAndUpdateResponse,AddDocResponse, NewUser, OnboardingAnswers, User } from "@/app/types";
import { findOneAndUpdateDoc } from "./mongo/update";
import { hashPassword } from '@/app/lib/cryptography';
import dbConnect from '@/app/lib/db';
import { getDoc } from '@/app/lib/mongo/get';
import { addDoc } from '@/app/lib/mongo/add';
import UserModel from '@/app/models/user';


export async function getUser(email: string): Promise<User | null> {
  try {
    await dbConnect();
    const result =  await getDoc<User>(UserModel, {email})
    if(!result.success || !result.data) throw new Error(result.message);
    const user = result.data;
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
   return null
  }
}

// try carch not needed as used in parent function 
export async function signUp(newUser: NewUser): Promise<AddDocResponse> {
  await dbConnect();
  const {password, ...userInfo} = newUser;
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt)
  const user: User = {...userInfo, hashedPassword, salt};
  return addDoc<User>(UserModel, user);
}

// try carch not needed as used in parent function 
export async function completedOnboarding(email: string, answers:OnboardingAnswers): Promise<FindOneAndUpdateResponse<User>> {
  await dbConnect()
    const filter = { email };
    const update = {
      'metadata.answers': answers,
      'metadata.hasCompletedOnboarding': true,
    };
  
    return await findOneAndUpdateDoc<User>(UserModel, filter, update);
  }

  // try carch not needed as used in parent function 
  export async function updatePassword(email: string, newPassword: string): Promise<FindOneAndUpdateResponse<User>> {
    await dbConnect();
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(newPassword, salt)
    return findOneAndUpdateDoc(UserModel, {email}, {hashedPassword, salt});
  }

  export async function isValidUser(email: string): Promise<boolean> {
    try {
      await dbConnect();
      const user = await UserModel.findOne({email})
      return !!user;
    } catch (error: any) {
      console.error('Error checking user: ', error?.message)
      return false
    }
  }

  