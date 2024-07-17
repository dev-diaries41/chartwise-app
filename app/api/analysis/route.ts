import { AuthErrors, RequestErrors } from "@/app/constants/errors";
import { CHART_ANALYSIS_URL, FPF_LABS_API_KEY } from "@/app/constants/app";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { JobReceipt } from "@/app/types";


export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const image = formdata.get('image') as string | null;
    const userId = formdata.get('userId') as string | null;
    const strategyAndCriteria = formdata.get('strategyAndCriteria') as string | null;
    const currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!userId) return NextResponse.json({ message: AuthErrors.INVALID_USER_ID, status: 401}, {status:401});
    if (!image) return NextResponse.json({ message: RequestErrors.MISSING_IMAGE, status: 400},{status:400} );
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    const headers = {
      'Authorization': `Bearer ${currentToken}`,
      'api-key': FPF_LABS_API_KEY
    }

    const reqBody = {when: Date.now(), jobData: {image, userId, strategyAndCriteria}}
    const response = await axios.post(CHART_ANALYSIS_URL, reqBody, {headers});
    const { message, data} = response.data;

    if(response.status !== 200 || !data)return NextResponse.json({ message, status: response.status});

    const newToken = response.headers['authorization']?.split(' ')[1];

    if (!newToken) throw new Error(AuthErrors.MISSING_JWT_TOKEN);
  
    const nextResponse = NextResponse.json(response.data as JobReceipt);
    nextResponse.headers.append('Authorization', `Bearer ${newToken}`);

    return nextResponse; 
  } catch (error: any) {
    console.error('Error startig analysis', error.message)
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status })
  }
};