import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

// Fix: Define a typed Request with user for handlers that use req.user
interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: 'ADMIN' | 'SENDER' | 'RECEIVER';
  };
}

// Your handlers

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserService.getSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Cast req as AuthRequest to access user
  const authReq = req as AuthRequest;
  if (!authReq.user?.id) throw new Error('User not authenticated');

  const updatedUser = await UserService.updateUser(id, req.body, authReq.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await UserService.deleteUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: deletedUser,
  });
});

const getMyParcels = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;
  if (!userId) throw new Error('User ID missing');

  const result = await UserService.getParcelsBySender(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Your parcels retrieved successfully',
    data: result,
  });
});

const getMyIncomingParcels = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;
  if (!userId) throw new Error('User ID missing');

  const result = await UserService.getParcelsForReceiver(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Incoming parcels retrieved successfully',
    data: result,
  });
});

const confirmParcelDelivery = catchAsync(async (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const result = await UserService.confirmParcelDelivery(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Parcel delivery confirmed',
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.blockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User blocked successfully',
    data: result,
  });
});

const getMeProfile = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;
  if (!userId) throw new Error('User ID missing');

  const user = await UserService.getSingleUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile retrieved successfully',
    data: user,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.unblockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User unblocked successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getMyParcels,
  getMyIncomingParcels,
  confirmParcelDelivery,
  blockUser,
  unblockUser,
  getMeProfile,
};
