import { Router } from 'express';
import { fileRouter } from './file';
import { userRouter } from './user';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use('/files', authMiddleware, fileRouter);
router.use('/users', userRouter);

export { router };