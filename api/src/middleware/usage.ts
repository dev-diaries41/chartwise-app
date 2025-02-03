import { NextFunction, Request, Response } from "express";
import { AuthErrors, ServerErrors, ServiceUsageErrors } from "@src/constants/errors";
import { getSubscription } from "@src/utils/stripe";
import * as Usage from "@src/services/usage";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { FREE_TOTAL_LIMIT } from "@src/constants/services";


export async function checkUsageLimit(req: Request, res: Response, next: NextFunction) {
    const userId = req.jwtPayload?.email;
    try {
        if (!userId) {
            return res.status(400).json({ message: AuthErrors.INVALID_USER_ID });
        }

        const {amount, status} = await getSubscription(userId) || {};
        const maxMonthlyUsage = Usage.getMaxMonthlyUsage(amount, status);
        const monthlyUsage = await Usage.getMonthlyUsageCount(userId, config?.queues?.chartAnalysis!);
        const totalUsage = await Usage.getTotalUsageCount(userId, config?.queues?.chartAnalysis!);


        if (monthlyUsage === 0 && totalUsage === 0) {
            return next();
        }
        

        const limits = {
            monthly: maxMonthlyUsage,
            total: status !== 'active' ? FREE_TOTAL_LIMIT : null,  
        };

        // check if free usage limit has been reached
        if (limits.total && (totalUsage + 1 > limits.total)) {
            logger.error({ message: ServiceUsageErrors.EXCEEDED_FREE_LIMIT, userId, totalUsage });
            return res.status(403).json({ message: ServiceUsageErrors.EXCEEDED_FREE_LIMIT });
        }

        if (limits.monthly && (monthlyUsage + 1 > limits.monthly)) {
            logger.error({ message: ServiceUsageErrors.EXCEEDED_PLAN_LIMIT, userId, monthlyUsage });
            return res.status(403).json({ message: ServiceUsageErrors.EXCEEDED_PLAN_LIMIT });
        }
    

        next();
    } catch (error: any) {
        logger.error({message: ServiceUsageErrors.FAILED_USAGE_CHECK, details: error.message});
        return res.status(500).json({ message: ServerErrors.INTERNAL_SERVER });
    }
}