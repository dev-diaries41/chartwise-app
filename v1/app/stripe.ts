import Stripe from "stripe";
import { PaymentDetails } from "@/app/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_LIVE_KEY!, {
    apiVersion: "2024-04-10",
});

export const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE!;

export async function handlePaymentComplete({email, name, receipt_url, chargeId}: PaymentDetails){
    console.log({email, name, receipt_url, chargeId})
    console.log('payment details receviing succesffuly')
}