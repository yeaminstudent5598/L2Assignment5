import express from 'express';
import { parcelRoutes } from '../modules/parcel/parcel.routes';
import { dashboardRoutes } from '../modules/dashboard/dashboard.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/parcels',
    route: parcelRoutes,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;