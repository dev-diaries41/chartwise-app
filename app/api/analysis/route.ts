import { AuthErrors, JobErrors, RequestErrors, ToolErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { StoredAnalysis } from "@/app/types";


export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const analysis = formdata.get('analysis') as string | null;
    let currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!analysis) return NextResponse.json({ message: 'Invalid analysis input', status: 400},{status:400} );
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    let jsonAnalysis = JSON.parse(analysis) as Omit<StoredAnalysis, 'userId'>;
    chartwiseAPI.token = currentToken;
    const { data, token } = await chartwiseAPI.analyse(jsonAnalysis);
    const nextResponse = NextResponse.json({data});
    if(token) {
      nextResponse.headers.append('Authorization', `Bearer ${token}`);
    }
    return nextResponse; 
  } catch (error: any) {
   return handleError(error)
  }
};