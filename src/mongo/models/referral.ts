import mongoose from 'mongoose';
import { IReferral } from '../../types';


const referralSchema = new mongoose.Schema({
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});


export const Referrals = mongoose.model<IReferral>('Referrals', referralSchema);
