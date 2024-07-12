import { JobErrors } from "@/app/constants/errors";
import { CHART_ANALYSIS_RESULTS_URL, FPF_LABS_API_KEY } from "@/app/constants/app";
import { JobResult } from "@/app/types";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get('jobId')
    const currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!currentToken) {
      throw new Error('No token provided');
    }

    const headers = {
      'Authorization': `Bearer ${currentToken}`,
      'api-key': FPF_LABS_API_KEY
    }

    const response = await axios.get(`${CHART_ANALYSIS_RESULTS_URL}/${jobId}`, {headers});
    const jobResults = response.data as JobResult;

    if(!jobResults)throw new Error(JobErrors.INVALID_JOB_RESULTS);

    const newToken = response.headers['authorization']?.split(' ')[1];
    if (!newToken) {
      throw new Error('No new token provided');
    }
       // Create a new NextResponse to append the header
       const nextResponse = NextResponse.json(jobResults);

       // Append the Authorization header
       nextResponse.headers.append('Authorization', `Bearer ${newToken}`);
  
      return nextResponse; 

  } catch (error: any) {
    console.error(JobErrors.INVALID_JOB_RESULTS, error.message)
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status }) 
  }
};
