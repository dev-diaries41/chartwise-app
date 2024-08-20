import express from 'express';
import * as JournalController from '@src/controllers/journal';

const router = express.Router();

router.post('/', [JournalController.addEntry]);
router.get('/', [JournalController.getEntries]);


export default router;
