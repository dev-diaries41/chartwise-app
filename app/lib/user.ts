import { PlanAmount, StorageKeys, Time } from "../constants/app";
import { UserPlan, UserProfileInfo } from "../types";
import {SessionStorage} from "./storage"

  export function cacheUserPlan (userPlan: UserPlan) {
    const ttl = Time.min;
    const expiresAt = Date.now() + ttl;
    SessionStorage.set(StorageKeys.subscription, JSON.stringify({ userPlan, expiresAt } as UserProfileInfo));
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

