import mongoose from 'mongoose';
import { FindOneAndUpdateResponse } from '@/app/types';

export async function findOneAndUpdateDoc<T>(model: mongoose.Model<T>, filter: Record<string, any>, update: Record<string, any>): Promise<FindOneAndUpdateResponse<T>> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session, new: true, lean: true }; // Using lean to get a plain JS object
    const updatedDoc = await model.findOneAndUpdate(filter, update, options).select('-_id -__v'); // Exclude _id and __v

    await session.commitTransaction();
    session.endSession();
    if (updatedDoc) {
      return { success: true, message: 'Document updated successfully', updatedDoc };
    } 
    return { success: false, message: 'Document not found or no changes made' };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error updating document: ${error.message}`);
    return { success: false, message: error.message };
  }
}


