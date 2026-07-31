import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from "../modules/users/user.routes.js";
import operationRoutes from '../modules/operations/operation.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/operations', operationRoutes);


export default router;