import mongoose from 'mongoose';
import { User } from '@/app/types';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  metadata: {
    answers: {
      tradingAssets: { type: [String] },               
      tradingExperience: { type: [String] },          
      analysisMethods: { type: [String] },             
      tradingGoals: { type: [String] }                
    },
    creationDate: { type: Date, default: Date.now },
    hasCompletedOnboarding: { type: Boolean, default: false },
  }         
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Convert _id to string in JSON output
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Convert _id to string in object output
      return ret;
    }
  }
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
