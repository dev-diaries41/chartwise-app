import { handlePaymentComplete } from '@/app/stripe';
import { WEBHOOK_SECRET, stripe } from '@/app/stripe';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {

  const sig = req.headers.get('stripe-signature');
  const payload = await req.text();

  let event;

  try {
    if(!sig)throw new Error('Invalid webhook signature')
    event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_SECRET);
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  switch (event.type) {
      case 'invoice.paid':
          const subInvoicePaid = event.data.object;
          handlePaymentComplete({email: subInvoicePaid.customer_email, name: subInvoicePaid.customer_name || '', chargeId: subInvoicePaid.charge?.toString() || '', receipt_url: subInvoicePaid.hosted_invoice_url!});
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({status: "success"})
}
