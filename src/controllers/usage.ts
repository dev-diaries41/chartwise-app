
import { Request, Response } from "express";
import * as Usage from "@src/services/usage";
import { config } from "@src/config";
import { cache } from "@src/index";

// Daily usage controller with cache
export async function todaysUsage(req: Request, res: Response) {
  const { userId } = req.params;
  const cacheKey = `todaysUsage:${userId}`;
  
  try {
    const cachedData = await cache.get<number>(cacheKey);
    if (cachedData) {
      return res.status(200).json({ data: cachedData });
    }

    const todaysUsage = await Usage.getTodaysUsageCount(userId, config?.queues?.chartAnalysis!);
    await cache.set(cacheKey, todaysUsage);
    return res.status(200).json({ data: todaysUsage });
  } catch (error: any) {
    console.error(`Error in todaysUsage controller: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function monthlyUsage(req: Request, res: Response) {
  const { userId } = req.params;
  const cacheKey = `monthlyUsage:${userId}`;
  
  try {
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ data: cachedData });
    }

    const monthlyUsage = await Usage.getMonthlyUsageCount(userId, config?.queues?.chartAnalysis!);
    await cache.set(cacheKey, monthlyUsage);
    return res.status(200).json({ data: monthlyUsage });
  } catch (error: any) {
    console.error(`Error in monthlyUsage controller: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Total usage controller with cache
export async function totalUsage(req: Request, res: Response) {
  const { userId } = req.params;
  const cacheKey = `totalUsage:${userId}`;
  
  try {
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ data: cachedData });
    }

    const totalUsage = await Usage.getTotalUsageCount(userId, config?.queues?.chartAnalysis!);
    await cache.set(cacheKey, totalUsage);
    return res.status(200).json({ data: totalUsage });
  } catch (error: any) {
    console.error(`Error in totalUsage controller: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}