import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { cookies } from "next/headers";
import { Time } from "@/app/constants/global";


export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId)throw new Error(AuthErrors.INVALID_USER_ID);
    
    const token = await chartwiseAPI.getAuthToken(userId);
    chartwiseAPI.token = token;

    const cookieStore = cookies();
    cookieStore.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'strict',
      maxAge: Time.hour/1000,
    })
    const nextResponse = NextResponse.json({ status: 200 }, {status:200});
    nextResponse.headers.append('Authorization', `Bearer ${token}`);
    return nextResponse;
  } catch (error: any) {
    return handleError(error)
  }
}
