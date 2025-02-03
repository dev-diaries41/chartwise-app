import mongoose from 'mongoose';
import { IUser } from '@src/types';


const userSchema = new mongoose.Schema({
  name: { type: String, },
  username: { type: String, },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
});


export const User = mongoose.model<IUser>('User', userSchema);

