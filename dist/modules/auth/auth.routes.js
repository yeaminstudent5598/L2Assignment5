"use strict";
// src/modules/auth/auth.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.patch('/reset-password', authMiddleware_1.authenticate, auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
