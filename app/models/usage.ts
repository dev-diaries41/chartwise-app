import mongoose from 'mongoose';

const ServiceUsagetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  usageDate: { type: Date, default: Date.now, required: true },
});

ServiceUsagetSchema.index({ userId: 1, service: 1 });

export default mongoose.models.ServiceUsage || mongoose.model("ServiceUsage", ServiceUsagetSchema);
