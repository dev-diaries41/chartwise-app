import { IAnalysis } from "@/app/types";
import { getDoc } from "@/app/lib/mongo/get";
import ChartAnalysisModel from "@/app/models/analysis"

export async function getAnalysis(id: string): Promise<IAnalysis> {
    const { success, data, message } = await getDoc<IAnalysis>(ChartAnalysisModel, { _id: id });
    if (!success || !data) throw new Error(message);
    return data;
}