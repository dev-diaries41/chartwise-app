import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { APIResponse } from "@/app/types/response";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { IAnalysis } from "@/app/types";
import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
  try {
    const analysis = await req.json() as Omit<IAnalysis, 'userId'>;;
    const cookieStore = cookies();
    const jwtCookie = cookieStore.get('jwt')
    const token = jwtCookie?.value;

    if (!analysis) return NextResponse.json({ message: 'Missing analysis', status: 400}, {status:400});
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    chartwiseAPI.token = token;

    const { data }: APIResponse<string> = await chartwiseAPI.saveAnalysis(analysis);  
    return  NextResponse.json({data}); 
  } catch (error: any) {
    return handleError(error)
  }
};