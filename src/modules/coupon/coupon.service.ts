import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';

// কুপন তৈরি করা (অ্যাডমিন করবে)
const createCoupon = async (payload: ICoupon): Promise<ICoupon> => {
  const existingCoupon = await Coupon.findOne({ code: payload.code.toUpperCase() });
  if (existingCoupon) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon code already exists');
  }
  return await Coupon.create({ ...payload, code: payload.code.toUpperCase() });
};

// সব কুপন দেখা (অ্যাডমিন প্যানেলের জন্য)
const getAllCoupons = async (): Promise<ICoupon[]> => {
  return await Coupon.find().sort({ createdAt: -1 });
};

// কুপন ভ্যালিডেট করা (পার্সেল বুকিংয়ের সময় ইউজার করবে)
const validateCoupon = async (code: string): Promise<ICoupon> => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid or expired coupon code');
  }
  
  return coupon;
};

// কুপন ডিলিট করা
const deleteCoupon = async (id: string) => {
  const result = await Coupon.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  deleteCoupon,
};