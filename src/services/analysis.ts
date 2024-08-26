import { generateTextFromImage, generateTextFromMutliImages } from "@src/ai/openai";
import { chartAnalysisMultiPrompt, chartAnalysisPrompt } from "@src/ai/prompts";
import { ChartAnalysis } from "@src/mongo/models/analysis";
import { addDoc } from "@src/mongo/utils/add";
import { getDoc } from "@src/mongo/utils/get";
import { ServiceJobData, AddDocResponse, Analysis, IAnalyseCharts } from "@src/types";
import { uploadMultiple } from "@src/utils/data/cloudinary";
import { AnalysisJobScehma } from "@src/utils/validation";


export async function analyseCharts(analysisJobDetails: IAnalyseCharts & ServiceJobData): Promise<{output: string} & ServiceJobData> {
    const validatedAnalysis = AnalysisJobScehma.safeParse(analysisJobDetails);
    if(!validatedAnalysis.success)throw new Error(JSON.stringify(validatedAnalysis.error))
    const prompt = analysisJobDetails.chartUrls.length > 0? chartAnalysisMultiPrompt(analysisJobDetails.metadata): chartAnalysisPrompt(analysisJobDetails.metadata);
    const output = analysisJobDetails.chartUrls.length > 0? await generateTextFromMutliImages(prompt, analysisJobDetails.chartUrls): await generateTextFromImage(prompt, analysisJobDetails.chartUrls[0]);
    if(!output)throw new Error('INVALID_AI_RESPONSE_ERROR');
    return {output, initiatedBy: analysisJobDetails.initiatedBy, userId: analysisJobDetails.userId};
}

export async function saveChartAnalysis(analysis: Analysis): Promise<AddDocResponse>{
        const uploadOpts = {folder: 'chart_analysis'};
        const chartUrls = await uploadMultiple(analysis.chartUrls, uploadOpts)
        const result = await addDoc(ChartAnalysis, {...analysis, chartUrls});
        return result;
}

export async function getAnalysis(id: string): Promise<Analysis> {
      const { success, data, message } = await getDoc<Analysis>(ChartAnalysis, { _id: id });
      if (!success || !data) throw new Error(message);
      return data;
}