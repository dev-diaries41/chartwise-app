import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { StoredAnalysis } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'invalid analysis id', status: 400},{status:400} );
    const {data} = await chartwiseAPI.getSharedAnalysis(id);
    const savedAnalysis = data as StoredAnalysis;
    return  NextResponse.json({data: savedAnalysis}); 
  } catch (error: any) {
    return handleError(error)
  }
};