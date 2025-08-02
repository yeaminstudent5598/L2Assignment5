"use strict";
// src/modules/parcel/parcel.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const parcel_controller_1 = require("./parcel.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SENDER'), parcel_controller_1.ParcelController.createParcel);
router.get('/my-parcels', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SENDER'), parcel_controller_1.ParcelController.getSenderParcels);
router.patch('/cancel/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SENDER'), parcel_controller_1.ParcelController.cancelParcel);
router.get('/incoming-parcels', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('RECEIVER'), parcel_controller_1.ParcelController.getReceiverParcels);
router.patch('/confirm-delivery/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('RECEIVER'), parcel_controller_1.ParcelController.confirmDelivery);
// Add delivery history route
router.get('/delivery-history', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SENDER', 'RECEIVER', 'ADMIN'), parcel_controller_1.ParcelController.getDeliveryHistory);
router.get('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), parcel_controller_1.ParcelController.getAllParcels);
router.patch('/update-status/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), parcel_controller_1.ParcelController.updateParcelStatus);
router.patch('/block/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), parcel_controller_1.ParcelController.blockParcel);
router.patch('/unblock/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), parcel_controller_1.ParcelController.unblockParcel);
// Add tracking ID route
router.get('/tracking/:trackingId', parcel_controller_1.ParcelController.getParcelByTrackingId);
// Add status log route
router.get('/:parcelId/status-log', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN', 'SENDER', 'RECEIVER'), parcel_controller_1.ParcelController.getParcelStatusLog);
router.get('/:id', authMiddleware_1.authenticate, parcel_controller_1.ParcelController.getParcelById);
router.get('/:id/status-log', parcel_controller_1.ParcelController.getParcelStatusLog);
router.get('/track/:trackingId', parcel_controller_1.ParcelController.getParcelByTrackingId);
exports.parcelRoutes = router;
