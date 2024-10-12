import mongoose from 'mongoose';
import { User } from '../types';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String},
  username: { type: String},
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);