import { Request, Response } from 'express';
import { logger } from '@src/logger';
import * as ReferralManager from '@src/services/referrals';
import { ServerErrors } from '@src/constants/errors';


function handleErrors(error: any, res: Response, customMessage: string) {
    const status = error.status || 500;
    const message = error.message || ServerErrors.INTERNAL_SERVER;
    logger.error({ message: customMessage, details: error.message });
    return res.status(status).json({ message });
}

// export async function createUserController(req: Request, res: Response,) {
//     try {
//         const { name, email } = req.body;
//         const response = await createUser(name, email);
//         res.status(201).json(response);
//     } catch (error: any) {
//         return handleErrors(error, res, 'Error creating user');
//     }
// }

export function generateReferralLinkController(req: Request, res: Response){
    try {
        const { referralCode } = req.params;
        const link = ReferralManager.generateReferralLink(referralCode);
        res.status(200).json({ referralLink: link });
    } catch (error: any) {
        return handleErrors(error, res, 'Error generating referral link');
    }
}

export async function createReferralController(req: Request, res: Response) {
    try {
        const { referrerCode, refereeId } = req.body;
        const response = await ReferralManager.createReferral(referrerCode, refereeId);
        res.status(201).json(response);
    } catch (error: any) {
        return handleErrors(error, res, 'Error creating referral');
    }
}

export async function completeReferralController(req: Request, res: Response) {
    try {
        const { referralId } = req.params;
        const response = await ReferralManager.completeReferral(referralId);
        res.status(200).json(response);
    } catch (error: any) {
        return handleErrors(error, res, 'Error completing referral');
    }
}

export async function getReferralStatusController(req: Request, res: Response){
    try {
        const { referralId } = req.params;
        const status = await ReferralManager.getReferralStatus(referralId);
        res.status(200).json({ status });
    } catch (error: any) {
        return handleErrors(error, res, 'Error getting referral status');
    }
}

export async function getUserReferralsController(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const response = await ReferralManager.getUserReferrals(userId);
        return res.status(200).json(response);
    } catch (error: any) {
        return handleErrors(error, res, 'Error getting user referrals');
    }
}
