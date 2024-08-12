import mongoose from "mongoose";

export interface IReferral {
    referrer: string;
    referee:string;
    status: 'pending' | 'completed';
    createdAt: Date;
}

// User Document Interface
export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    referralCode: string;
    referredBy?: mongoose.Types.ObjectId;
    referredUsers: mongoose.Types.ObjectId[];
}