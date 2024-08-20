import mongoose from 'mongoose';
import { convertToNumber } from '../../utils/data/format';
import { GetDocResponse, GetDocsResponse } from '@src/types';
import { ServerErrors } from '../../constants/errors';

export async function getDoc<T>(model: mongoose.Model<T>,  filter: Record<string, any>): Promise<GetDocResponse<T>>{
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session };
    const document = await model.findOne(filter, null, options).session(session);

    if (!document) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: ServerErrors.NO_DOCS_FOUND };
    }

    await session.commitTransaction();
    session.endSession();
    return { success: true, data: document };
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
      return { success: false, message: ServerErrors.NO_DOCS_FOUND };
    }

    const skip = (pageNumber - 1) * perPageNumber;
    const documents = await model.find(filter, null, options).skip(skip).limit(perPageNumber).session(session);

    await session.commitTransaction();
    session.endSession();
    return { success: true, totalDocuments, page: pageNumber, perPage: perPageNumber, data: documents };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Error fetching documents: ${error.message}`);
    return { success: false, message: error.message };
  }
}
