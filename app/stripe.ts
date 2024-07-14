import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET_LIVE!, {
    apiVersion: "2024-04-10",
});

export const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE!;
