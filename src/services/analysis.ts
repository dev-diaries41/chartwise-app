import { generateTextFromImage, generateTextFromMutliImages } from "../ai/openai";
import { chartAnalysisMultiPrompt, chartAnalysisPrompt } from "../ai/prompts";
import { ChartAnalysis } from "../mongo/models/analysis";
import { addDoc } from "../mongo/utils/add";
import { getDoc } from "../mongo/utils/get";
import { ServiceJobDetails, AddDocResponse, Analysis, IAnalyseCharts } from "../types";
import { uploadMultiple } from "../utils/data/cloudinary";
import {AnalysisJobScehma } from "../utils/validation";


export async function analyseCharts(analysisJobDetails: IAnalyseCharts & ServiceJobDetails): Promise<{output: string} & Partial<ServiceJobDetails>> {
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