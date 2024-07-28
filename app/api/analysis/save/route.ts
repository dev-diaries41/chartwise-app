import { AuthErrors, RequestErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { ChartWiseAPIResponse } from "@/app/types/response";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { StoredAnalysis } from "@/app/types";


export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const analysis = formdata.get('analysis') as string | null;
    const currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!analysis) return NextResponse.json({ message: 'Missing analysis', status: 400}, {status:400});
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    let jsonAnalysis = JSON.parse(analysis) as Omit<StoredAnalysis, 'userId'>;

    chartwiseAPI.token = currentToken;
    const { data, token }: ChartWiseAPIResponse<string> = await chartwiseAPI.saveAnalysis(jsonAnalysis);  
    const nextResponse = NextResponse.json({data});
    nextResponse.headers.append('Authorization', `Bearer ${token}`);
    return nextResponse; 
  } catch (error: any) {
    return handleError(error)
  }
};