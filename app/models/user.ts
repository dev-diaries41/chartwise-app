import mongoose from 'mongoose';
import { User } from '@/app/types';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  metadata:{
    answers: {
      tradingAssets: { type: [String] },               
      tradingExperience: { type: [String] },          
      analysisMethods: { type: [String] },             
      tradingGoals: { type: [String] }                
    },
    creationDate: { type: Date, default: Date.now },
    hasCompletedOnboarding: { type: Boolean, default: false },
  }         
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
