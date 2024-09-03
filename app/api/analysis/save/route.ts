import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { ChartWiseAPIResponse } from "@/app/types/response";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { StoredAnalysis } from "@/app/types";


export async function POST(req: NextRequest) {
  try {
    const analysis = await req.json() as Omit<StoredAnalysis, 'userId'>;;
    const token = req.headers?.get('Authorization')?.split(' ')[1];

    if (!analysis) return NextResponse.json({ message: 'Missing analysis', status: 400}, {status:400});
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    const { data }: ChartWiseAPIResponse<string> = await chartwiseAPI.saveAnalysis(analysis);  
    return  NextResponse.json({data}); 
  } catch (error: any) {
    return handleError(error)
  }
};