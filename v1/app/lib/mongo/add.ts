import mongoose from 'mongoose';
import { AddDocResponse, AddMultipleDocsResponse } from '@/app/types';

export async function addDoc<T>(model: mongoose.Model<T>, doc: Record<string, any>): Promise<AddDocResponse> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const createdDoc = await model.create([doc], options);
    const id = createdDoc[0]._id as string; // Assuming you're inserting one document and expecting _id back


    await session.commitTransaction();
    session.endSession();
    return { success: true, message: 'Document added successfully', id};
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error saving Document: ${error.message}`);
    return { success: false, message: error.message as string };
  }
}

export async function addMultipleDocs<T>(model: mongoose.Model<T>, documents: Record<string, any>[]): Promise<AddMultipleDocsResponse> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const results = await model.insertMany(documents, options);

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: 'Documents added successfully', insertedCount: results.length };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error saving documents: ${error.message}`);
    return { success: false, message: error.message };
  }
}
