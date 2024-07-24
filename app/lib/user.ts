import { StorageKeys, Time } from "../constants/app";
import { UserPlan, UserProfileInfo } from "../types";
import { getSubscription } from "./actions";
import * as Storage from "./storage/local"

const PlanAmount = {
    basic:699,
    pro:2399,
    elite: 2999,
  }

export async function getUserPlan(userId: string|null|undefined): Promise<UserPlan>{
    if(!userId)return 'Free';

    try {
      const cachedPlanInfo = Storage.get(StorageKeys.subscription);
      if (cachedPlanInfo) {
        const { userPlan, expiresAt }: UserProfileInfo = cachedPlanInfo;
        if (expiresAt > Date.now() && userPlan) {
          return userPlan as UserPlan;
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

  export function getUserCredits(plan: UserPlan, monthlyUsage: number){
    if(plan === 'Free'){
      return 5 - monthlyUsage;
    }else if(plan === 'Basic'){
      return 100 - monthlyUsage;
    }else if(plan === 'Pro'){
      return 500 - monthlyUsage;
    }else if(plan === 'Elite'){
      return 1000 - monthlyUsage;
    }
    else{
      return 5 - monthlyUsage;
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

  export async function handleGetSubscriptionInfo (userId: string): Promise<string> {  
    const cachedData = Storage.get(StorageKeys.subscription);
    if (cachedData) {
      const { userPlan, expiresAt } = cachedData;
      if (Date.now() < expiresAt) {
        return userPlan;
      }
    }

    const plan = await getUserPlan(userId);
    const ttl = Time.min;
    const expiresAt = Date.now() + ttl;
    Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan: plan, expiresAt } as UserProfileInfo));
    return plan;
  };