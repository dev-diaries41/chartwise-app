import mongoose from 'mongoose';
import { roles } from '@src/constants/server';

const authSchema = new mongoose.Schema({
  userId: {type: String, required:true, unique: true},
  role: {type: String, required:true, default: roles.basic},
  hashedApiKey: {type: String, required:true, unique: true},
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now}
});


export const Auth = mongoose.model('Auth', authSchema);

