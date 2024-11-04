'use server'

import { ServiceUsageErrors } from "@/app/constants/errors";
import { countDocs } from "@/app/lib/mongo/count";
import ServiceUsage from "@/app/models/usage"
import { Usage } from "@/app/types";
import dbConnect from "@/app/lib/db";
import { FREE_MONTHLY_LIMIT } from "@/app/constants/usage";
import { PlanAmount } from "@/app/constants/global";
import Stripe from "stripe";
import { FREE_TOTAL_LIMIT, SERVICE_NAME } from "@/app/constants/usage";
import { getSubscription } from "../subscription";
import { AuthErrors } from "@/app/constants/errors";


export async function getTotalUsageCount(userId: string, service: string): Promise<number> {
    const filter = { userId, service };
    const result = await countDocs(ServiceUsage, filter);
  
    if (result?.totalDocuments!== undefined && result.totalDocuments >= 0) {
      return result.totalDocuments;
    } else {
      throw new Error(ServiceUsageErrors.FAILED_TOTAL_USAGE_CHECK);
    }
  }
  
  export async function getMonthlyUsageCount(userId: string, service: string): Promise<number> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const filter = { userId, service, usageDate: { $gte: startOfMonth } };
    const result = await countDocs(ServiceUsage, filter);
  
    if (result?.totalDocuments!== undefined && result.totalDocuments >= 0) {
      return result.totalDocuments;
    } else {
      throw new Error(ServiceUsageErrors.FAILED_MONTHLY_USAGE_CHECK);
    }
  }
  
  export async function getTodaysUsageCount(userId: string, service: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const filter = { userId, service, usageDate: { $gte: startOfDay } };
    const result = await countDocs(ServiceUsage, filter);
  
    if (result?.totalDocuments!== undefined && result.totalDocuments >= 0) {
      return result.totalDocuments;
    } else {
      throw new Error(ServiceUsageErrors.FAILED_DAILY_USAGE_CHECK);
    }
  }


  export async function getAllUsage(userId: string): Promise<Usage> {
    await dbConnect();
    const SERVICE = 'chart-analysis';
    const [todayData, monthData, totalData] = await Promise.all([
      getTodaysUsageCount(userId, SERVICE),
      getMonthlyUsageCount(userId, SERVICE),
      getTotalUsageCount(userId, SERVICE),
    ]);
    return { today: todayData, month: monthData, total: totalData };
  }



export async function checkUsageLimit(email: string | null | undefined) {
    if (!email) {
        return { isAllowed: false, message: AuthErrors.INVALID_USER_ID };
    }

    await dbConnect();

    const {subscription} = await getSubscription(email) || {};
    const subDetails =  {
      amount: subscription?.items.data[0]?.plan?.amount, 
      status: subscription?.status,
      isCancelled: !!subscription?.cancel_at_period_end,
    }
  
    const getMaxMonthlyUsage = (planCost: number | null | undefined, status: Stripe.Subscription['status'] | undefined) =>{
      switch(planCost){
          case PlanAmount.basic:
              return status === 'active'? 100 : FREE_MONTHLY_LIMIT;
          case PlanAmount.pro:
              return status === 'active'? 500 : FREE_MONTHLY_LIMIT;
          default:
              return FREE_MONTHLY_LIMIT;
      }
    }
  
    const maxMonthlyUsage = getMaxMonthlyUsage(subDetails.amount, subDetails.status);
    const monthlyUsage = await getMonthlyUsageCount(email,SERVICE_NAME);
    const totalUsage = await getTotalUsageCount(email,SERVICE_NAME);
 
    if (monthlyUsage === 0 && totalUsage === 0) {
        return {isAllowed: true, message: ''};
    }
    
    const limits = {
        monthly: maxMonthlyUsage,
        total: subDetails.status !== 'active' ? FREE_TOTAL_LIMIT : null,  
    };

    // check if free usage limit has been reached
    if (limits.total && (totalUsage + 1 > limits.total)) {
        console.warn({ message: ServiceUsageErrors.EXCEEDED_FREE_LIMIT, email, totalUsage });
        return { isAllowed: false, message: ServiceUsageErrors.EXCEEDED_FREE_LIMIT };
    }

    if (limits.monthly && (monthlyUsage + 1 > limits.monthly)) {
        console.warn({ message: ServiceUsageErrors.EXCEEDED_PLAN_LIMIT, email, monthlyUsage });
        return { isAllowed: false, message: ServiceUsageErrors.EXCEEDED_PLAN_LIMIT };
    }
    return {isAllowed: true, message: ''};
    
} 