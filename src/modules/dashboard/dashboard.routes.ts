import express from 'express';
import { authenticate, authorizeRoles } from '../../middlewares/authMiddleware'; 
import { DashboardController } from './dashboard.controller';

const router = express.Router();

// Route for Admin dashboard stats
router.get('/stats/admin', authenticate, authorizeRoles('ADMIN'), DashboardController.getAdminStats);

// Route for Sender dashboard stats
router.get('/stats/sender', authenticate, authorizeRoles('SENDER'), DashboardController.getSenderStats);

// Route for Receiver dashboard stats
router.get('/stats/receiver', authenticate, authorizeRoles('RECEIVER'), DashboardController.getReceiverStats);

// ✅ Route for Admin monthly trends chart
router.get('/trends/admin', authenticate, authorizeRoles('ADMIN'), DashboardController.getMonthlyTrends);

export const dashboardRoutes = router;