import { StorageKeys, Time } from "../constants/app";
import { UserPlan, UserProfileInfo } from "../types";
import { getSubscription } from "./actions";
import * as Storage from "./storage/session"

const PlanAmount = {
    basic:699,
    pro:2399,
    elite: 2999,
}

async function getUserPlan(userId: string|null|undefined): Promise<UserPlan>{
    if(!userId)return 'Free';

    try {
      const cachedPlanInfo = Storage.get<UserProfileInfo>(StorageKeys.subscription);
      if (cachedPlanInfo && typeof cachedPlanInfo === 'object') {
        const { userPlan, expiresAt } = cachedPlanInfo;
        if (expiresAt > Date.now() && userPlan) {
          return userPlan;
        }
      }
  
      const {subscription} = await getSubscription(userId) || {};
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

  function cacheUserPlan (userPlan: UserPlan) {
    const ttl = Time.min;
    const expiresAt = Date.now() + ttl;
    Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan, expiresAt } as UserProfileInfo));
  }

  export async function handleGetSubscriptionInfo (userId: string): Promise<{limit: number, plan: UserPlan}> {  
    const plan = await getUserPlan(userId);
    cacheUserPlan(plan);
    const limit = getMonthlyLimit(plan)
    return {limit, plan};
  };

  export function getMonthlyLimit(plan: UserPlan): number {
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

  export function getPlanFromPlanAmount(subscriptionAmount: number){
    if (subscriptionAmount === PlanAmount.basic) {
      return 'Basic';
    } else if (subscriptionAmount === PlanAmount.pro) {
      return 'Pro';
    } else if (subscriptionAmount === PlanAmount.elite) {
      return 'Elite';
    } 
  }

