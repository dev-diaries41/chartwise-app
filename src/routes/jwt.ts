import express from 'express';
import { refreshTokenController } from '../controllers/jwt';

const router = express.Router();

router.post('/', refreshTokenController);

export default router;
