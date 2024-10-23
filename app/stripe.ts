import Stripe from "stripe";
import { PaymentDetails } from "@/app/types";

const STRIPE_SECRET_KEY = process.env.NODE_ENV === 'development'? process.env.STRIPE_SECRET_TEST_KEY! : process.env.STRIPE_SECRET_LIVE_KEY!
const WEBHOOK_SECRET = process.env.NODE_ENV === 'development'? process.env.STRIPE_WEBHOOK_SECRET_TEST! : process.env.STRIPE_WEBHOOK_SECRET_LIVE!
const stripe = new Stripe(STRIPE_SECRET_KEY, {apiVersion: "2024-04-10"});


async function handlePaymentComplete({email, name, receipt_url, chargeId}: PaymentDetails){
    console.log({email, name, receipt_url, chargeId})
    console.log('payment details receviing succesffuly');
}

export {
    WEBHOOK_SECRET,
    stripe,
    handlePaymentComplete
}