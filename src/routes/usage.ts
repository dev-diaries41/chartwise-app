import express from 'express';
import * as UsageController from '../controllers/usage';

const router = express.Router();

router.get('/daily/:userId', UsageController.dailyUsage);
router.get('/monthly/:userId', UsageController.monthlyUsage);
router.get('/total/:userId', UsageController.totalUsage);


export default router;
