// src/modules/user/user.routes.ts

import express from 'express';
import { UserController } from './user.controller';
import { authenticate, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', UserController.createUser);

// Add this route:
router.get('/me', authenticate, UserController.getMeProfile);


router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  UserController.getAllUsers
);
router.get(
  '/receivers', 
  authenticate, 
  authorizeRoles(
    'ADMIN', 'SENDER'),
     UserController.getReceivers);

router.patch(
  '/block/:userId',
  authenticate,
  authorizeRoles('ADMIN'),
  UserController.blockUser
);

router.patch(
  '/unblock/:userId',
  authenticate,
  authorizeRoles('ADMIN'),
  UserController.unblockUser
);

router.delete("/:id", 
  authenticate, 
  authorizeRoles('ADMIN'), 
  UserController.deleteUser)

router.patch("/:id", 
  authenticate, authorizeRoles
  ('ADMIN', 'SENDER', 'RECEIVER'),
  UserController.updateUser
)

export const UserRoutes = router;
