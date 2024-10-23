'use server'
import { IAnalysis } from "@/app/types";
import { getDoc, getDocs } from "@/app/lib/mongo/get";
import ChartAnalysisModel from "@/app/models/analysis"
import dbConnect from "@/app/lib/db";

export async function getAnalysis(id: string): Promise<IAnalysis> {
    await dbConnect()
    const { success, data, message } = await getDoc<IAnalysis>(ChartAnalysisModel, { _id: id });
    if (!success || !data) throw new Error(message);
    return data;
}


// Only get the most 50 recent 50
export async function getAnalyses(userId: string): Promise<(IAnalysis & {_id: string})[]> {
    try{
        await dbConnect();
        const { success, data, message } = await getDocs<IAnalysis & {_id: string} >(ChartAnalysisModel, { userId }, 1, 50, '_id name timestamp');
        if (!success || !data) throw new Error(message);
        return data; 
    }catch(error: any){
        console.error(`Error getting analyses for ${userId}: `, error.message)
        return []
    }
}