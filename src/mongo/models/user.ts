import mongoose from 'mongoose';
import { IUser } from '@src/types';


const userSchema = new mongoose.Schema({
  name: { type: String, },
  email: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


export const User = mongoose.model<IUser>('User', userSchema);

