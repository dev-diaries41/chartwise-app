import { AuthErrors } from "@/app/constants/errors";
import { NextRequest, NextResponse } from "next/server";
import { chartwiseAPI } from "@/app/lib/requests/chartwise-api";
import { handleError } from "@/app/lib/requests/next-api-errors";
import { TradeJournalEntry } from "@/app/types";


export async function POST(req: NextRequest) {
  try {
    const token = req.headers?.get('Authorization')?.split(' ')[1];
    const entry = await req.json() as TradeJournalEntry;

    if (!entry) return NextResponse.json({ message: 'Invalid journal entry', status: 400},{status:400} );
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );

    const { data } = await chartwiseAPI.addJournalEntry(entry);
    return NextResponse.json({data}); 
  } catch (error: any) {
   return handleError(error);
  }
};

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get('page');
    const perPage = req.nextUrl.searchParams.get('perPage');
    const token = req.headers?.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: AuthErrors.MISSING_JWT_TOKEN, status: 401},{status:401} );
    if (!page || !perPage) return NextResponse.json({ message: 'invalid page or perPage', status: 400},{status:400} );
    
    const {data} = await chartwiseAPI.getJournalEntries(page, perPage);
    return NextResponse.json({data}); 
  } catch (error: any) {
    return handleError(error)
  }
};