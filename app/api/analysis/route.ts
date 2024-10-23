import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { AnalysisParams } from "@/app/types";
import { cookies } from "next/headers";
import limiter from "@/app/config/limiter";
import { auth } from "@/auth";


export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user.email;
    if (!userId) return NextResponse.json({ message: AuthErrors.UNAUTHORIZED, status: 401},{status:401} );

    try {
      await limiter(userId).consume(userId); // Attempt to consume 1 token for this user
    } catch (error) {
      console.error('Rate limiting error:', error);
    }

    const analysis = await req.json() as AnalysisParams;
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get('jwt');
    const token = jwtCookie?.value;

    if (!analysis) return NextResponse.json({ message: 'Invalid analysis input', status: 400},{status:400} );
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );
    chartwiseAPI.token = token;
    
    const { data } = await chartwiseAPI.analyse(analysis);
    return NextResponse.json({data});; 
  } catch (error: any) {
    console.error(error);
    if (error?.remainingPoints <= 0) {
      return NextResponse.json({
        message: 'Too Many Requests',
        retryAfter: `${error.msBeforeNext}ms`,
      }, {status: 429 })
    }
    return handleError(error)
  }
}