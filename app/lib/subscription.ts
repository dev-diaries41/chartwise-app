'use server'
import { PlanAmount } from "@/app/constants/app";
import { UserPlan } from "@/app/types";
import { getSubscription } from "@/app/lib/actions";

async function getUserPlan(email: string|null|undefined): Promise<UserPlan>{
    if(!email)return 'Free';

    try {
      // const cachedPlanInfo = SessionStorage.get<UserProfileInfo>(StorageKeys.subscription);
      // if (cachedPlanInfo && typeof cachedPlanInfo === 'object') {
      //   const { userPlan, expiresAt } = cachedPlanInfo;
      //   if (expiresAt > Date.now() && userPlan) {
      //     return userPlan;
      //   }
      // }
      const {subscription} = await getSubscription(email) || {};
      if(!subscription)return 'Free';
  
      const subscriptionAmount = subscription?.items.data[0]?.plan?.amount;
  
      if (subscriptionAmount === PlanAmount.basic && subscription.status === 'active') {
        return 'Basic';
      } else if (subscriptionAmount === PlanAmount.pro && subscription.status === 'active') {
        return 'Pro';
      } else if (subscriptionAmount === PlanAmount.elite && subscription.status === 'active') {
        return 'Elite';
      } else {
        return 'Free';
      }
    } catch (error) {
      console.error('Error getting user plan:', error);
      return 'Free';
    }
  }

  export async function handleGetSubscriptionInfo (userId: string|null|undefined): Promise<{limit: number, plan: UserPlan}> {  
    const plan = await getUserPlan(userId);
    const getMonthlyLimit = (plan: UserPlan): number  => {
        if(plan === 'Free'){
        return 30;
        }else if(plan === 'Basic'){
        return 100 ;
        }else if(plan === 'Pro'){
        return 500 ;
        }else if(plan === 'Elite'){
        return 1000 ;
        }
        else{
        return 30;
        }
    }
    const limit = getMonthlyLimit(plan)
    return {limit, plan};
  };

