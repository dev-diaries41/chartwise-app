import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_LIVE_KEY!, {
    apiVersion: "2024-04-10",
});

export const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE!;
