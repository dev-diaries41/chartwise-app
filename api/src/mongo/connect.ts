import mongoose from 'mongoose';

export default async function connectDB(url: string) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (err: any) {
    console.error('Failed to connect with MongoDB: ', err.message);
    throw err
  }
}