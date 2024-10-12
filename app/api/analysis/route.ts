import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { AnalysisParams } from "@/app/types";
import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
  try {
    const analysis = await req.json() as AnalysisParams;
    const cookieStore = cookies();
    const jwtCookie = cookieStore.get('jwt')
    const token = jwtCookie?.value;

    if (!analysis) return NextResponse.json({ message: 'Invalid analysis input', status: 400},{status:400} );
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    chartwiseAPI.token = token;
    
    const { data } = await chartwiseAPI.analyse(analysis);
    return NextResponse.json({data});; 
  } catch (error: any) {
   return handleError(error)
  }
};