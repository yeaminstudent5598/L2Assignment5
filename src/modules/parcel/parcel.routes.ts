// src/modules/parcel/parcel.routes.ts

import express from 'express';
import { ParcelController } from './parcel.controller';
import { authenticate, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();


router.post(
  '/',
  authenticate,
  authorizeRoles('SENDER'),
  ParcelController.createParcel
);

router.get(
  '/my-parcels',
  authenticate,
  authorizeRoles('SENDER'),
  ParcelController.getSenderParcels
);

router.patch(
  '/cancel/:id',
  authenticate,
  authorizeRoles('SENDER'),
  ParcelController.cancelParcel
);

router.get(
  '/incoming-parcels',
  authenticate,
  authorizeRoles('RECEIVER'),
  ParcelController.getReceiverParcels
);

router.patch(
  '/confirm-delivery/:id',
  authenticate,
  authorizeRoles('RECEIVER'),
  ParcelController.confirmDelivery
);

// Add delivery history route
router.get(
  '/delivery-history',
  authenticate,
  authorizeRoles('SENDER', 'RECEIVER', 'ADMIN'),
  ParcelController.getDeliveryHistory
);

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  ParcelController.getAllParcels
);

router.patch(
  '/update-status/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  ParcelController.updateParcelStatus
);

router.patch(
  '/block/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  ParcelController.blockParcel
);

router.patch(
  '/unblock/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  ParcelController.unblockParcel
);

// Add tracking ID route
router.get(
  '/tracking/:trackingId',
  ParcelController.getParcelByTrackingId
);

// Add status log route
router.get(
  '/:parcelId/status-log',
  authenticate,
  authorizeRoles('ADMIN', 'SENDER', 'RECEIVER'),
  ParcelController.getParcelStatusLog
);

export const parcelRoutes = router;
