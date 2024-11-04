import mongoose from 'mongoose';

const ServiceUsageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  usageDate: { type: Date, default: Date.now, required: true },
});

ServiceUsageSchema.index({ userId: 1, service: 1 });

export default mongoose.models.ServiceUsage || mongoose.model("ServiceUsage", ServiceUsageSchema);
