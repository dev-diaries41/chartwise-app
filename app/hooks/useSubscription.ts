import React, { useEffect, useState } from "react";
import { UserPlan, UserProfileInfo } from "../types";
import { StorageKeys, Time } from "../constants/app";
import * as Storage from "@/app/lib/storage/local";
import { getUserPlan } from "../lib/user";


export default function useSubscription (userId: string | null | undefined, isLoading: boolean) {
    const [ userPlan, setUserPlan ] = useState<UserPlan | null>(null);
  
    const handleGetSubscriptionInfo = async (userId: string) => {  

      const cachedData = Storage.get<UserProfileInfo>(StorageKeys.subscription);
      if(cachedData && typeof cachedData === 'object'){
        const { userPlan, expiresAt } = cachedData;
        if (Date.now() < expiresAt) {
          setUserPlan(userPlan);
          return;
        }
    }
  
      const plan = await getUserPlan(userId);
      const ttl = Time.min;  // short ttl to handle case user subscribes. This ensures the new plan is reflected
      const expiresAt = Date.now() + ttl;
      setUserPlan(plan)
      Storage.set(StorageKeys.subscription, JSON.stringify({ userPlan: plan, expiresAt } as UserProfileInfo));
    };
  
    useEffect(() => {
      if (!isLoading && userId)  {
        handleGetSubscriptionInfo(userId);
      }
    }, [isLoading, userId,]);
  
  
    return {
      userPlan,
      setUserPlan,
    };
  };