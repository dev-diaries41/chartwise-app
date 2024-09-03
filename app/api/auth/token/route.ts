import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";


export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId)throw new Error(AuthErrors.INVALID_USER_ID);
    
    const newToken = await chartwiseAPI.getAuthToken( userId );
    const nextResponse = NextResponse.json({ status: 200 }, {status:200});
    nextResponse.headers.append('Authorization', `Bearer ${newToken}`);
    return nextResponse;
  } catch (error: any) {
    return handleError(error)
  }
}
