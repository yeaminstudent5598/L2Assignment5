// src/modules/auth/auth.routes.ts

import express from 'express';
import { AuthControllers } from './auth.controller';
import { authenticate } from '../../middlewares/authMiddleware';


const router = express.Router();

router.post("/login", AuthControllers.credentialsLogin)
router.post("/logout", AuthControllers.logout)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.patch('/reset-password', authenticate, AuthControllers.resetPassword);

export const AuthRoutes = router;
