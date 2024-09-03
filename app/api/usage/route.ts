import { AuthErrors, ServiceUsageErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { UsagePeriod } from "@/app/types";
import { handleError } from "@/app/lib/requests/next-api-errors";


export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    const period = req.nextUrl.searchParams.get('period')
    if (!userId) throw new Error(AuthErrors.INVALID_USER_ID);
    if (!period) throw new Error('Invalid usage period');

    const {data} = await chartwiseAPI.getUsage(userId, period as UsagePeriod)
    if(!data)throw new Error(ServiceUsageErrors.FAILED_USAGE_CHECK + ` for ${period}`);

    return  NextResponse.json({data}, {status:200});; 
  } catch (error: any) {
   return handleError(error)
  }
};
