import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

// For Admin: Get overview stats for all parcels
const getAdminOverviewStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await DashboardService.getAdminOverviewStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin dashboard overview stats fetched successfully',
    data: stats,
  });
});

// For Sender: Get stats for a specific sender
const getSenderStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id; // From authenticate middleware
  const stats = await DashboardService.getSenderStats(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Sender dashboard stats fetched successfully',
    data: stats,
  });
});


export const DashboardController = {
  getAdminOverviewStats,
  getSenderStats,
};