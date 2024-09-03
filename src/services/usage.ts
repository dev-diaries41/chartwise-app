import Stripe from "stripe";
import { ServiceUsageErrors } from "@src/constants/errors";
import { ServiceUsage } from "@src/mongo/models/usage";
import { addDoc } from "@src/mongo/utils/add";
import { countDocs } from "@src/mongo/utils/count";
import { FREE_MONTHLY_LIMIT } from "@src/constants/services";


export async function addUsage(userId: string, service: string){
      return addDoc(ServiceUsage, {userId, service})
}

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

export function getMaxMonthlyUsage(planCost: number | null | undefined, status: Stripe.Subscription['status'] | undefined){
  switch(planCost){
      case 699:
          return status === 'active'? 100 : FREE_MONTHLY_LIMIT;
      case 2399:
          return status === 'active'? 500 : FREE_MONTHLY_LIMIT;
      case 2999:
          return status === 'active'? 1000 : FREE_MONTHLY_LIMIT;
      default:
          return FREE_MONTHLY_LIMIT;
  }
}