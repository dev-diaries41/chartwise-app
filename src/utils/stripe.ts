import Stripe from 'stripe';
import dotenv from 'dotenv'
dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_LIVE_KEY!, {
    apiVersion: "2024-06-20",
});


export async function getSubscription(email: string) {
    try {
      const customer = await stripe.customers.list({
        email,
        limit: 1,
      });
    
      if (customer.data.length === 0) return null;
    
      const subscription = await stripe.subscriptions.list({
        limit: 1,
        customer: customer.data[0].id,
      });
  
      if (subscription.data.length === 0) return null;

      return {
        subscription: subscription.data[0],
      };
    } catch (err:any) {
      console.error(err.message)
      return null;
    }
  }