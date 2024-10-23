import Stripe from 'stripe';
import dotenv from 'dotenv'
dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY!, {
    apiVersion: "2024-06-20",
});


export async function getSubscription(email: string): Promise<{amount: number | null, status: Stripe.Subscription.Status} | null> {
    try {
      const customer = await stripe.customers.list({email, limit: 1});
      if (customer.data.length === 0) return null;
    
      const subscription = await stripe.subscriptions.list({limit: 1, customer: customer.data[0].id});
      if (subscription.data.length === 0) return null;

      const subData = subscription.data[0];

      return {
        amount: subData?.items.data[0]?.plan?.amount, 
        status: subData?.status
      };
    } catch (err:any) {
      console.error(err.message)
      return null;
    }
  }