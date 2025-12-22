import { Schema, model } from 'mongoose';
import { ICoupon } from './coupon.interface';

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Coupon = model<ICoupon>('Coupon', couponSchema);