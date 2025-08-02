import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { AuthRoutes } from './modules/auth/auth.routes';
import { UserRoutes } from './modules/user/user.routes';
import { parcelRoutes } from './modules/parcel/parcel.routes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/parcels', parcelRoutes);

// Health check or root
app.get('/', (req: Request, res: Response) => {
  res.send('Parcel Delivery API is running');
});


export default app;
