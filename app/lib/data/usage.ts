'use server'

import { ServiceUsageErrors } from "@/app/constants/errors";
import { countDocs } from "@/app/lib/mongo/count";
import ServiceUsage from "@/app/models/usage"
import { Usage } from "@/app/types";
import dbConnect from "@/app/lib/db";

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