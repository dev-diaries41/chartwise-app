import express from 'express';
import * as AuthControllers from '@src/controllers/auth';

const router = express.Router();

router.post('/token', AuthControllers.refreshToken);

export default router;
