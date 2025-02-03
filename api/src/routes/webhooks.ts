import { telegramChartAnalysis } from '@src/controllers/telegram';
import express from 'express';

const router = express.Router();

router.post('/analysis', telegramChartAnalysis);

export default router;
