import express from 'express';
import * as UsageController from '@src/controllers/usage';

const router = express.Router();

router.get('/today/:userId', UsageController.todaysUsage);
router.get('/month/:userId', UsageController.monthlyUsage);
router.get('/total/:userId', UsageController.totalUsage);


export default router;
