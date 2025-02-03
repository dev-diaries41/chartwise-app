'use server'
import { PlanAmount } from "@/app/constants/global";
import { UserPlan, UserPlanOverView } from "@/app/types";
import { stripe } from "../stripe";
import Stripe from "stripe";
import { SubscriptionMessages } from "../constants/messages";


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
      }  else {
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
        return 6;
        }else if(plan === 'Basic'){
        return 100 ;
        }else if(plan === 'Pro'){
        return 500 ;
        }else{
        return 6;
        }
    }
    const limit = getMonthlyLimit(userPlanOverview.plan)
    return {limit, userPlanOverview};
  };

  export async function cancelSubscription(email: string): Promise<boolean>{
    try {
      const {subscription} = await getSubscription(email) || {};
      if(!subscription) throw new Error('Invalid subscription');
      if(subscription.cancel_at_period_end)return subscription.cancel_at_period_end;  // early return if already cancelled
  
      const canclledSubscription = await stripe.subscriptions.update(subscription.id, {cancel_at_period_end: true});
      return canclledSubscription.cancel_at_period_end;
    } catch (error: any) {
      console.error('Error cancelled user subscription:', error.message);
      return false;
    }
  }

  const getAmountFromPlan = (plan: UserPlan): number | undefined => {
    if (plan === 'Basic') {
      return PlanAmount.basic;
    } else if (plan === 'Pro') {
      return PlanAmount.pro;
    } 
    return undefined;
  }


export async function upgradeSubscription(email: string, planToUpgrade: UserPlan): Promise<{ success: boolean, message: string }> {
  try {
    const { subscription } = await getSubscription(email) || {};
    if (!subscription) {
      return { success: false, message: SubscriptionMessages.noSubscriptionToUpgrade};
    }

    const itemId = subscription.items.data[0].id;
    const newPlanAmount = getAmountFromPlan(planToUpgrade);
    if (!newPlanAmount) {
      throw new Error('Error finding plan amount');
    }

    const newPlanPriceData = await findPriceData(newPlanAmount);
    if (!newPlanPriceData) {
      throw new Error('Error finding price plan data');
    }

    // Update the subscription and bill immediately
    const upgradedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: itemId,
          price: newPlanPriceData?.id,
        }
      ],
      proration_behavior: 'create_prorations',
      billing_cycle_anchor: 'now',
    });

    // Check if the subscription was successfully upgraded and is active
    if (upgradedSubscription.status === 'active') {
      // Retrieve the latest invoice that was automatically generated
      const invoice = await stripe.invoices.retrieve(upgradedSubscription.latest_invoice as string);
      if (invoice.paid) {
        return { success: true, message: SubscriptionMessages.subscriptionUpgradeSuccess };
      } else {
        return { success: false, message: SubscriptionMessages.paymentFailed};
      }
    } 
    return { success: false, message: SubscriptionMessages.upgradeFailed};
  } catch (error: any) {
    console.error(`Error in upgradeSubscription: ${error.message}`);
    return { success: false, message: SubscriptionMessages.unknownError};
  }
}

  async function findPriceData(planAmount: number):  Promise<Stripe.Price | undefined>{
    const priceData = await stripe.prices.list({limit: 10 });
    const plan = priceData.data.find(price => price.unit_amount === planAmount);
    return plan
  }

