import mongoose from 'mongoose';
import { IAnalysis } from '@/app/types';

const AnalysisSchema = new mongoose.Schema({
  name: { type: String, required: true },
  output: { type: String, required: true },
  chartUrls: { type: Array, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
  userId: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  formatVersion: { type: Number, required: true, default: 3 },
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

export default mongoose.models.ChartAnalysis || mongoose.model<IAnalysis>("ChartAnalysis", AnalysisSchema);
