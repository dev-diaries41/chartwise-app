import { storedAnalysisSchema } from "../constants/schemas";
import { StoredAnalysis } from "../types";

export function validateAnalysis(analysis: Omit<StoredAnalysis, 'userId'>){
    const storedAnalysisWithoutUserIdSchema = storedAnalysisSchema.omit({ userId: true });
    return storedAnalysisWithoutUserIdSchema.safeParse(analysis)
}