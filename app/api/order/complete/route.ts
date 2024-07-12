import { stripe } from '@/app/stripe';
import { NextRequest, NextResponse } from 'next/server';
 
export const dynamic = 'force-dynamic'


export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    if(!sessionId)throw new Error('Invalid session id');
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({ session }, {status:200});

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }

}
