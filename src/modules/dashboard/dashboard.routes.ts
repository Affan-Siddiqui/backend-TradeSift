import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getDashboardSummaryHandler } from './dashboard.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', getDashboardSummaryHandler);

export default router;
