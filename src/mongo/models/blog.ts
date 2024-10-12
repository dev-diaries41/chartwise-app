import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, required: true, default: 'Admin' },
  tags: { type: [String], default: [] },
  createdAt: { type: Number, default: Date.now }, 
  updatedAt: { type: Number, default: Date.now },
  published: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

BlogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const BlogModel = mongoose.model('Blog', BlogSchema);
