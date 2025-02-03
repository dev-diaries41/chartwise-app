import express from 'express';
import { getSharedAnalysis } from '@src/controllers/analysis';

const router = express.Router();

router.get('/:id', [getSharedAnalysis]);


export default router;
