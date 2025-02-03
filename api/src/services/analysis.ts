import {ServiceJobData} from "qme";
import { generateTextFromImage, generateTextFromMutliImages } from "@src/services/ai/openai";
import {  chartAnalysisPrompt } from "@src/services/ai/prompts";
import { AnalysisJobScehma } from "@src/constants/schemas";
import { Time } from "@src/constants/server";
import { ChartAnalysis } from "@src/mongo/models/analysis";
import { addDoc } from "@src/mongo/utils/add";
import { getDoc } from "@src/mongo/utils/get";
import { AddDocResponse, Analysis, IAnalyseCharts } from "@src/types";
import { uploadMultiple } from "@src/utils/data/cloudinary";

async function simOutput(){
    const wait = async(duration: number) => await new Promise(resolve => setTimeout(resolve, duration));
    const simDuration = (min: number = 10, max: number = 20): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const durartion = simDuration();
    await wait (Time.sec * durartion);
    const output = `This is a simulated analysis ${Date.now()}.`;
    return output;
}

export async function analyseCharts(analysisJobDetails: IAnalyseCharts & ServiceJobData): Promise<{output: string} & ServiceJobData> {
    const validatedAnalysis = AnalysisJobScehma.safeParse(analysisJobDetails);
    if(!validatedAnalysis.success)throw new Error(JSON.stringify(validatedAnalysis.error));

    const {metadata, chartUrls, ...serviceJobData} = validatedAnalysis.data;
    const prompt =  chartAnalysisPrompt(metadata, chartUrls.length > 1)
    const output = chartUrls.length > 0? await generateTextFromMutliImages(prompt, chartUrls) : await generateTextFromImage(prompt, chartUrls[0]);
    // const output = await simOutput();
    if(!output)throw new Error('INVALID_AI_RESPONSE_ERROR');
    return {output, ...serviceJobData};
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