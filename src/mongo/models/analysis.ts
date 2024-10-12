import mongoose from 'mongoose';
import { Analysis } from '@src/types';



const analysisSchema = new mongoose.Schema({
  output: { type: String, required: true },
  chartUrls: { type: Array, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
  userId: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  formatVersion: { type: Number, required: true, default: 3 },
});

export const ChartAnalysis = mongoose.model<Analysis>('ChartAnalysis', analysisSchema);
