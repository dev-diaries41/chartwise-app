import mongoose from 'mongoose';
import { DeleteDocResponse, DeleteDocsResponse } from '@src/types';


export async function deleteDoc<T>(model: mongoose.Model<T>, filter: Record<string, any>): Promise<DeleteDocResponse> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const result = await model.deleteOne(filter, options);

    if (result.deletedCount === 1) {
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: `Document deleted successfully` };
    } else {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: `Document not found for filter: ${filter}` };
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error deleting document: ${error.message}`);
    return { success: false, message: error.message };
  }
}

export async function deleteDocs<T>(model: mongoose.Model<T>, filter: Record<string, any>): Promise<DeleteDocsResponse> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };  
    const result = await model.deleteMany(filter, options);

    if (result.deletedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: `Documents deleted successfully` };
    } else {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: `Documents not found for filter: ${filter}` };
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error deleting documents: ${error.message}`);
    return { success: false, message: error.message };
  }
}