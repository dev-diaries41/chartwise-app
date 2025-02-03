import mongoose from 'mongoose';

const serviceUsagetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  usageDate: { type: Date, default: Date.now, required: true },
});

serviceUsagetSchema.index({ userId: 1, service: 1 });

export const ServiceUsage = mongoose.model('ServiceUsage', serviceUsagetSchema);
