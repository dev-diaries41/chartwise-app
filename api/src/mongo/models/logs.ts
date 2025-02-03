import mongoose from 'mongoose';
import { LogEntry } from '@src/types';

const LogEntrySchema = new mongoose.Schema<LogEntry>({
  category: { type: String, required: true },
  formatVersion: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  userId: { type: String },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

export const LogEntryModel = mongoose.model<LogEntry>('LogEntry', LogEntrySchema);
