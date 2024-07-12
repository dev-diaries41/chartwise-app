import { AuthErrors, RequestErrors } from "@/app/constants/errors";
import { FPF_LABS_API_KEY, SAVE_ANALYSIS_URL } from "@/app/constants/app";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const chart = formdata.get('chart') as string | null;
    const analysis = formdata.get('analysis') as string | null;
    const currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!analysis) return NextResponse.json({ message: 'Missing analysis', status: 400}, {status:400});
    if (!chart) return NextResponse.json({ message: RequestErrors.MISSING_IMAGE, status: 400},{status:400} );
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    const headers = {
      'Authorization': `Bearer ${currentToken}`,
      'api-key': FPF_LABS_API_KEY
    }

    const reqBody = {chart, analysis};
    const response = await axios.post(SAVE_ANALYSIS_URL, reqBody, {headers});
    const { message, data}: {message: string, data: string} = response.data;

    if(response.status !== 200 || !data)return NextResponse.json({ message, status: response.status}, {status: response.status});

    const newToken = response.headers['authorization']?.split(' ')[1];

    if (!newToken) throw new Error(AuthErrors.MISSING_JWT_TOKEN);
  
    const nextResponse = NextResponse.json({data});
    nextResponse.headers.append('Authorization', `Bearer ${newToken}`);
    return nextResponse; 
  } catch (error: any) {
    console.error(error)
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status })
  }
};