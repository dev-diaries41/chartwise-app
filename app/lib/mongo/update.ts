import mongoose from 'mongoose';
import { FindOneAndUpdateResponse } from '@/app/types';

export async function findOneAndUpdateDoc<T>(model: mongoose.Model<T>, filter: Record<string, any>, update: Record<string, any>): Promise<FindOneAndUpdateResponse<T>> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session, new: true };
    const updatedDoc = await model.findOneAndUpdate(filter, update, options);

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


