"use strict";
// src/modules/user/user.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/register', user_controller_1.UserController.createUser);
// Add this route:
router.get('/me', authMiddleware_1.authenticate, user_controller_1.UserController.getMeProfile);
router.get('/my-parcels', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('SENDER'), user_controller_1.UserController.getMyParcels);
router.get('/incoming-parcels', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('RECEIVER'), user_controller_1.UserController.getMyIncomingParcels);
router.patch('/confirm/:parcelId', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('RECEIVER'), user_controller_1.UserController.confirmParcelDelivery);
router.get('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), user_controller_1.UserController.getAllUsers);
router.patch('/block/:userId', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), user_controller_1.UserController.blockUser);
router.patch('/unblock/:userId', authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), user_controller_1.UserController.unblockUser);
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN'), user_controller_1.UserController.deleteUser);
router.patch("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRoles)('ADMIN', 'SENDER', 'RECEIVER'), user_controller_1.UserController.updateUser);
exports.UserRoutes = router;
