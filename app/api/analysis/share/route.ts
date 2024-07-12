import {  FPF_LABS_API_KEY, SHARED_ANALYSIS_URL } from "@/app/constants/app";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')

    const headers = {
      'api-key': FPF_LABS_API_KEY
    }

    const response = await axios.get(`${SHARED_ANALYSIS_URL}/${id}`, {headers});
    const {data} = response.data;
    const savedAnalysis = data as {analysis: string, chartUrl: string};

    if(!savedAnalysis)throw new Error('Invalid analysis');

    const nextResponse = NextResponse.json(savedAnalysis);
    return nextResponse; 
  } catch (error: any) {
    console.error('Error getting saved analysos:', error.message)
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status }) 
  }
};
