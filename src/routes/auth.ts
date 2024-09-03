import express from 'express';
import * as AuthControllers from '@src/controllers/auth';

const router = express.Router();

router.post('/token', AuthControllers.refreshToken);
router.post('/login', AuthControllers.login);
router.post('/register', AuthControllers.register);
router.post('/logout', AuthControllers.logout);

export default router;
