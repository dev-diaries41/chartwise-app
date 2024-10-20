import mongoose from 'mongoose';
import { convertToNumber } from '@/app/lib/helpers';
import { GetDocResponse, GetDocsResponse } from '@/app/types';
import { RequestErrors, ServerErrors } from '@/app/constants/errors';

export async function getDoc<T>(model: mongoose.Model<T>,  filter: Record<string, any>): Promise<GetDocResponse<T>>{
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const document = await model.findOne(filter, null, options).session(session);
    if (!document) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: RequestErrors.NO_DOCS_FOUND };
    }

    await session.commitTransaction();
    session.endSession();
    return { success: true, data: document.toObject() };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error fetching data from document: ${error.message}`);
    return { success: false, message: error.message };
  }
}

export async function getDocs<T>(model: mongoose.Model<T>, filter: Record<string, any>, page: string | number = 1, perPage: string | number = 10): Promise<GetDocsResponse<T>> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const pageNumber = convertToNumber(page, 1);
    const perPageNumber = convertToNumber(perPage, 10);
    const totalDocuments = await model.countDocuments(filter, options).session(session);

    if (totalDocuments === 0) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: RequestErrors.NO_DOCS_FOUND };
    }

    const skip = (pageNumber - 1) * perPageNumber;
    const documents = await model
    .find(filter, '-_id -__v', options) 
    .lean() 
    .skip(skip)
    .limit(perPageNumber)
    .session(session);
    
    await session.commitTransaction();
    session.endSession();
    return { success: true, totalDocuments, page: pageNumber, perPage: perPageNumber, data: documents as T[] };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error fetching documents: ${error.message}`);
    return { success: false, message: error.message };
  }
}


export async function aggregate<T>(model: mongoose.Model<T>,pipeline: mongoose.PipelineStage[],session: mongoose.ClientSession | null = null): Promise<GetDocsResponse<T>> {
  const aggregationSession = session || await mongoose.startSession();
  aggregationSession.startTransaction();
  
  try {
    const options = { session: aggregationSession };
    const data = await model.aggregate(pipeline, options);

    if (!data || data.length === 0) {
      await aggregationSession.abortTransaction();
      aggregationSession.endSession();
      return { success: false, message: RequestErrors.NO_DOCS_FOUND };
    }

    await aggregationSession.commitTransaction();
    aggregationSession.endSession();
    
    return { success: true, data };
  } catch (error: any) {
    await aggregationSession.abortTransaction();
    aggregationSession.endSession();
    console.error(`Error executing aggregation: ${error.message}`);
    return { success: false, message: error.message };
  }
}
