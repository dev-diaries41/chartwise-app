import { AuthErrors, JobErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";


export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get('jobId')
    if (!jobId) return NextResponse.json({ message: JobErrors.INVALID_JOB_ID, status: 400},{status:400} );

    const currentToken = req.headers?.get('Authorization')?.split(' ')[1];
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    chartwiseAPI.token = currentToken;
    const {data, token } = await chartwiseAPI.getJobResult(jobId);
    const nextResponse = NextResponse.json({data});

    if(token) {
      nextResponse.headers.append('Authorization', `Bearer ${token}`);
    }
    return nextResponse; 
  } catch (error: any) {
    return handleError(error)
  }
};
