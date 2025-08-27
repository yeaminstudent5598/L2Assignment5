import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';

// For Admin Stats
const getAdminStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await DashboardService.getAdminStats();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Admin stats fetched successfully', data: stats });
});

// For Sender Stats
const getSenderStats = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'Not authorized');
  const userId = req.user.id;
  const stats = await DashboardService.getSenderStats(userId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Sender stats fetched successfully', data: stats });
});

// For Receiver Stats
const getReceiverStats = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, 'Not authorized');
    const userId = req.user.id;
    const stats = await DashboardService.getReceiverStats(userId);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Receiver stats fetched successfully', data: stats });
});

// ✅ For Admin Chart
const getMonthlyTrends = catchAsync(async (req: Request, res: Response) => {
    const trends = await DashboardService.getMonthlyTrends();
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Monthly trends fetched successfully', data: trends });
});

export const DashboardController = {
  getAdminStats,
  getSenderStats,
  getReceiverStats,
  getMonthlyTrends, // <-- নতুন ফাংশনটি এক্সপোর্ট করা হয়েছে
};