import mongoose from 'mongoose';


export async function countDocs(model: mongoose.Model<any>, filter: Record<string, any>): Promise<{totalDocuments?: number, message?: string}> {
    try {
      const totalDocuments = await model.countDocuments(filter);
      return { totalDocuments};
    } catch (error: any) {
      console.error(`Error fetching documents: ${error.message}`);
      return { message: error.message };
    }
  }