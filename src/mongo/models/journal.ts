import mongoose from 'mongoose';
import { ITradeJournalEntry } from '../../types';


const tradeJournalEntrySchema = new mongoose.Schema({
    entryId: { type: Number, required: true },
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
  
  tradeJournalEntrySchema.index({ entryId: 1, userId: 1 });


export const TradeJournal = mongoose.model<ITradeJournalEntry>('TradeJournal', tradeJournalEntrySchema);
