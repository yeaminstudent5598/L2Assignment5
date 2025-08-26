import express from 'express';
import { authenticate, authorizeRoles } from '../../middlewares/authMiddleware';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

// Route for Admin dashboard stats
router.get(
  '/stats/admin',
  authenticate,
  authorizeRoles('ADMIN'),
  DashboardController.getAdminOverviewStats
);

// Route for Sender dashboard stats
router.get(
  '/stats/sender',
  authenticate,
  authorizeRoles('SENDER'),
  DashboardController.getSenderStats
);

export const dashboardRoutes = router;