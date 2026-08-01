import type { Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/ApiResponse.js';
import { ApiError } from '../../common/ApiError.js';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { getDashboardSummary } from './dashboard.service.js';

export const getDashboardSummaryHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Authentication required.');

    const summary = await getDashboardSummary(req.userId);

    res.status(200).json(new ApiResponse('Dashboard summary fetched.', summary));
  } catch (err) {
    next(err);
  }
};
