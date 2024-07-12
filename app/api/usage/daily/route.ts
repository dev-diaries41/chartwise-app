import { ServiceUsageErrors } from "@/app/constants/errors";
import {FPF_LABS_API_KEY, USAGE_URL } from "@/app/constants/app";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    const headers = {
      'api-key': FPF_LABS_API_KEY
    }

    const response = await axios.get(`${USAGE_URL}/daily/${userId}`, {headers});
    const monthlyUsage = response.data as {data: number};

    if(!monthlyUsage)throw new Error(ServiceUsageErrors.FAILED_MONTHLY_USAGE_CHECK);

    const nextResponse = NextResponse.json(monthlyUsage);
    return nextResponse; 
  } catch (error: any) {
    console.error(ServiceUsageErrors.FAILED_MONTHLY_USAGE_CHECK, error.message)
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    return NextResponse.json({ message, status, success: false }, { status }) 
  }
};
