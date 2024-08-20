import express from 'express';
import * as ReferralController from '@src/controllers/referrals'

const router = express.Router();

// router.post('/user', ReferralController.createUserController);
router.get('/referral/link/:referralCode', ReferralController.generateReferralLinkController);
router.post('/referral', ReferralController.createReferralController);
router.patch('/referral/:referralId/complete', ReferralController.completeReferralController);
router.get('/referral/:referralId/status', ReferralController.getReferralStatusController);
router.get('/user/:userId/referrals', ReferralController. getUserReferralsController);

export default router;
