'use server'
import { PlanAmount } from "@/app/constants/global";
import { UserPlan, UserPlanOverView } from "@/app/types";
import { stripe } from "../stripe";
import Stripe from "stripe";


export async function getSubscription(email: string):Promise<{subscription: Stripe.Subscription;} | null> {
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

async function getUserPlan(email: string|null|undefined): Promise<UserPlanOverView>{
    if(!email)return {plan:'Free'};
    let cancel_at_end_billing: boolean = false;

    try {
      const {subscription} = await getSubscription(email) || {};
      if(!subscription)return {plan:'Free'};
      const {cancel_at_period_end} = subscription;
      cancel_at_end_billing = cancel_at_period_end;
  
      const subscriptionAmount = subscription?.items.data[0]?.plan?.amount;
  
      if (subscriptionAmount === PlanAmount.basic && subscription.status === 'active') {
        return {plan:'Basic', cancel_at_period_end};
      } else if (subscriptionAmount === PlanAmount.pro && subscription.status === 'active') {
        return {plan:'Pro', cancel_at_period_end};
      } else if (subscriptionAmount === PlanAmount.elite && subscription.status === 'active') {
        return {plan:'Elite', cancel_at_period_end};
      } else {
        return {plan:'Free', cancel_at_period_end};
      }
    } catch (error) {
      console.error('Error getting user plan:', error);
      return {plan:'Free', cancel_at_period_end: cancel_at_end_billing};
    }
  }

  export async function handleGetSubscriptionInfo (userId: string|null|undefined): Promise<{limit: number; userPlanOverview: UserPlanOverView}> {  
    const userPlanOverview = await getUserPlan(userId);
    const getMonthlyLimit = (plan: UserPlan): number  => {
        if(plan === 'Free'){
        return 10;
        }else if(plan === 'Basic'){
        return 100 ;
        }else if(plan === 'Pro'){
        return 500 ;
        }else if(plan === 'Elite'){
        return 1000 ;
        }
        else{
        return 10;
        }
    }
    const limit = getMonthlyLimit(userPlanOverview.plan)
    return {limit, userPlanOverview};
  };

  export async function cancelSubscription(email: string){
    try {
      const {subscription} = await getSubscription(email) || {};
      if(!subscription) throw new Error('Invalid subscription');
  
      const canclledSubscription = await stripe.subscriptions.update(subscription.id, {cancel_at_period_end: true});
      console.log(canclledSubscription);
    } catch (error: any) {
      console.error('Error cancelled user subscription:', error.message);
    }
  }