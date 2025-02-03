import mongoose from 'mongoose';
import { TradeJournalEntry } from '@/app/types';


const TradeJournalEntrySchema = new mongoose.Schema({
    entryId: { type: String, required: true },
    userId: { type: String, required: true},
    tradeDate: { type: Date, required: true },
    symbol: { type: String, required: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number, required: true },
    stopLoss: { type: Number },
    takeProfit: { type: Number },
    comments: { type: String },
    sentiment: { type: String, enum: ['bullish', 'bearish', 'neutral'] },
    createdAt: { type: Date, default: Date.now  },
    updatedAt: { type: Date, default: Date.now },
  });
  
  TradeJournalEntrySchema.index({ entryId: 1, userId: 1 }, { unique: true });

  export default mongoose.models.TradeJournal || mongoose.model<TradeJournalEntry>("TradeJournal", TradeJournalEntrySchema);

