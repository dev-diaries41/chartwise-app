import { NextFunction, Request, Response } from "express";
import { AuthErrors, ServerErrors, ServiceUsageErrors } from "../constants/errors";
import { getSubscription } from "../utils/stripe";
import * as Usage from "../services/usage";
import { config } from "../config";
import { logger } from "../logger";
import { FREE_DAILY_LIMIT, FREE_MONTHLY_LIMIT } from "../constants/services";


export async function checkUsageLimit(req: Request, res: Response, next: NextFunction) {
    const {userId} = req.jwtPayload || {};
    try {
        if (!userId) {
            return res.status(400).json({ message: AuthErrors.INVALID_USER_ID });
        }

        const {subscription} = await getSubscription(userId) || {};
        const maxMonthlyUsage = Usage.getMaxMonthlyUsage(subscription?.items.data[0]?.plan?.amount, subscription?.status);
        const dailyUsage = await Usage.getDailyUsageCount(userId, config?.queues?.chartAnalysis!);
        const monthlyUsage = await Usage.getMonthlyUsageCount(userId, config?.queues?.chartAnalysis!);

        // user doesnt exist yet or hasnt used any tools today or this month
        if (dailyUsage === 0 || monthlyUsage === 0) {
            return next();
        }

            // Define usage limits and errors
            const limits = {
                daily: subscription?.status !== 'active' ? FREE_DAILY_LIMIT : null,
                monthly: maxMonthlyUsage,
            };

            const errors = {
                daily: ServiceUsageErrors.EXCEEDED_FREE_LIMIT,
                monthly: ServiceUsageErrors.EXCEEDED_PLAN_LIMIT,
            };

            // Check usage limits
            if (limits.daily && dailyUsage + 1 > limits.daily) {
                logger.error({ message: errors.daily, userId, dailyUsage });
                return res.status(403).json({ message: errors.daily });
            }

            if (limits.monthly && monthlyUsage + 1 > limits.monthly) {
                logger.error({ message: errors.monthly, userId, monthlyUsage });
                return res.status(403).json({ message: errors.monthly });
            }

        next();
    } catch (error: any) {
        logger.error({message: ServiceUsageErrors.FAILED_USAGE_CHECK, details: error.message});
        return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
}
