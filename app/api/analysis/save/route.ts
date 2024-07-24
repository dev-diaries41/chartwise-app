import { AuthErrors, RequestErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { ChartWiseAPIResponse } from "@/app/types/response";
import { handleError } from "@/app/lib/requests/next-api-errors";


export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const chart = formdata.get('chart') as string | null;
    const analysis = formdata.get('analysis') as string | null;
    const currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!analysis) return NextResponse.json({ message: 'Missing analysis', status: 400}, {status:400});
    if (!chart) return NextResponse.json({ message: RequestErrors.MISSING_IMAGE, status: 400},{status:400} );
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    chartwiseAPI.token = currentToken;
    const { data, token }: ChartWiseAPIResponse<string> = await chartwiseAPI.saveAnalysis(chart, analysis);  
    const nextResponse = NextResponse.json({data});
    nextResponse.headers.append('Authorization', `Bearer ${token}`);
    return nextResponse; 
  } catch (error: any) {
    return handleError(error)
  }
};