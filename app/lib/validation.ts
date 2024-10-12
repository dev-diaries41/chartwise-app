import { StoredAnalysisSchema } from "../constants/schemas";
import { IAnalyse } from "../types";

export function validateAnalysis(analysis: Omit<IAnalyse, 'userId'>){
    const StoredAnalysisWithoutUserIdSchema = StoredAnalysisSchema.omit({ userId: true });
    return StoredAnalysisWithoutUserIdSchema.safeParse(analysis)
}