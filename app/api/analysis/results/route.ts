import { AuthErrors, JobErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";


export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ message: JobErrors.INVALID_JOB_ID, status: 400},{status:400} );

    const token = req.headers?.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    const {data} = await chartwiseAPI.getJobResult(jobId);
    return NextResponse.json({data}); 
  } catch (error: any) {
    return handleError(error)
  }
};
