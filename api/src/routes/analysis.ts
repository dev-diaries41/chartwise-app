import express from 'express';
import * as ChartAnalysisController from '@src/controllers/analysis';
import { checkUsageLimit } from '@src/middleware/usage';
import { authAnalysisResults } from '@src/middleware';

const router = express.Router();

router.post('/', [checkUsageLimit, ChartAnalysisController.analyseChart]);
router.post('/save', [ChartAnalysisController.saveAnalysis]);
router.get('/results/:jobId', [authAnalysisResults, ChartAnalysisController.getAnalysisResult]);
router.post('/recurring', [ChartAnalysisController.analyseChartRecurring]);


export default router;
