import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCoupon(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getAllCoupons();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    data: result,
  });
});

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.params;
  const result = await CouponService.validateCoupon(code);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon is valid',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CouponService.deleteCoupon(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: null,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  deleteCoupon,
};