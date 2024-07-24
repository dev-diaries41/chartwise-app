import { AuthErrors, RequestErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";


export async function POST(req: NextRequest) {
  try {
    const formdata = await req.formData();
    const image = formdata.get('image') as string | null;
    const strategyAndCriteria = formdata.get('strategyAndCriteria') as string | null;
    const risk = formdata.get('risk') as string | null;
    let currentToken = req.headers?.get('Authorization')?.split(' ')[1];

    if (!image) return NextResponse.json({ message: RequestErrors.MISSING_IMAGE, status: 400},{status:400} );
    if (!currentToken) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    chartwiseAPI.token = currentToken;
    const { data, token } = await chartwiseAPI.analyse(image, strategyAndCriteria, risk);
    const nextResponse = NextResponse.json({data});
    if(token) {
      nextResponse.headers.append('Authorization', `Bearer ${token}`);
    }
    return nextResponse; 
  } catch (error: any) {
   return handleError(error)
  }
};