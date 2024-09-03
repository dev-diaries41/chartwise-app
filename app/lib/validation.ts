import { StoredAnalysisSchema } from "../constants/schemas";
import { StoredAnalysis } from "../types";

export function validateAnalysis(analysis: Omit<StoredAnalysis, 'userId'>){
    const StoredAnalysisWithoutUserIdSchema = StoredAnalysisSchema.omit({ userId: true });
    return StoredAnalysisWithoutUserIdSchema.safeParse(analysis)
}