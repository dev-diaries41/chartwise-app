import mongoose from 'mongoose';
import { IAnalysis } from '@/app/types';



const AnalysisSchema = new mongoose.Schema({
  output: { type: String, required: true },
  chartUrls: { type: Array, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
  userId: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  formatVersion: { type: Number, required: true, default: 3 },
});

export default mongoose.models.ChartAnalysis || mongoose.model<IAnalysis>("ChartAnalysis", AnalysisSchema);

