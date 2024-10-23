import mongoose from "mongoose";

export function myQueryBuilder(model: mongoose.Model<any>, filter: Record<string, any>, options: any) {
    return model
      .find(filter, '-_id -__v', options)
      .lean();
  };
  