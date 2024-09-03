import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { hash } from '@src/utils/cryptography';
import { Auth } from '@src/mongo/models/auth';
import { User } from '@src/mongo/models/user';
import { registerUser } from '@src/services/auth';

export async function generateApiKey(email: string) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if user exists
    const userDocument = await User.findOne({ email }).session(session);

    if (!userDocument) {
    //   throw new Error('USER_NOT_FOUND_ERROR: This user does not exist. Register first');
    }

    const apiKey = randomBytes(32).toString('hex');
    const hashedApiKey = hash(apiKey);

    const userApiDocument = await Auth.findOne({ email }).session(session);

    if (userApiDocument) {
      userApiDocument.hashedApiKey = hashedApiKey;
      await userApiDocument.save();
    } else {
      await Auth.create([{ hashedApiKey, userId: email }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "API Key created successfully. Please store your API Key securely.",
      data: { apiKey },
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error generating API Key:', error.message);
    return {
      success: false,
      error: `API Key creation failed.`,
      data: null,
    };
  }
};
