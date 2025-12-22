import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { AuthRoutes } from './modules/auth/auth.routes';
import { UserRoutes } from './modules/user/user.routes';
import { parcelRoutes } from './modules/parcel/parcel.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { CouponRoutes } from './modules/coupon/coupon.routes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors({
  origin: "https://parcel-go.vercel.app",
  credentials: true,               
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/coupons', CouponRoutes);

// Health check or root
app.get('/', (req: Request, res: Response) => {
  res.send('Parcel Delivery API is running');
});


export default app;
