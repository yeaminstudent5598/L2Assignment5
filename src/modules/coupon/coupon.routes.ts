import express from 'express';
import { CouponController } from './coupon.controller';
import { authenticate, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

// ১. কুপন ভ্যালিডেট করা (যেকোনো লগইন করা ইউজার পারবে - SENDER/RECEIVER)
router.get(
  '/validate/:code',
  authenticate,
  CouponController.validateCoupon
);

// ২. সব কুপন দেখা (অ্যাডমিন এবং ইউজার উভয়েই দেখতে পারে অথবা শুধু অ্যাডমিন)
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  CouponController.getAllCoupons
);

// ৩. নতুন কুপন তৈরি (শুধু অ্যাডমিন)
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  CouponController.createCoupon
);

// ৪. কুপন ডিলিট (শুধু অ্যাডমিন)
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  CouponController.deleteCoupon
);

export const CouponRoutes = router;