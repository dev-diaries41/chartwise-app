import express from 'express';
import * as ChartAnalysisController from '../controllers/analysis';
import { checkUsageLimit } from '../middleware/usage';

const router = express.Router();

router.post('/', [checkUsageLimit, ChartAnalysisController.analyseChart]);
router.post('/save', [ChartAnalysisController.saveAnalysis]);
router.get('/results/:jobId', [ChartAnalysisController.authAnalysisResults, ChartAnalysisController.getAnalysisResult]);
router.post('/recurring', [ChartAnalysisController.analyseChartRecurring]);


export default router;
