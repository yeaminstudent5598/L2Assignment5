import { Request, Response } from 'express';
import { ParcelService } from './parcel.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.id;
  if (!senderId) throw new AppError(httpStatus.UNAUTHORIZED, 'Sender ID missing');

  const parcel = await ParcelService.createParcel(req.body, senderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Parcel created successfully',
    data: parcel,
  });
});

const getAllParcels = catchAsync(async (req: Request, res: Response) => {
  const options = req.query;
  const result = await ParcelService.getAllParcels(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All parcels retrieved successfully',
    data: result.data,
    meta: {
      page: Number(options.page) || 1,
      limit: Number(options.limit) || 10,
      total: result.total,
    },
  });
});

const getSenderParcels = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.id;
  if (!senderId) throw new AppError(httpStatus.UNAUTHORIZED, 'Sender ID missing');

  const options = req.query;
  const result = await ParcelService.getSenderParcels(senderId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sender parcels retrieved successfully',
    data: result.data,
    meta: {
      page: Number(options.page) || 1,
      limit: Number(options.limit) || 5,
      total: result.total,
    },
  });
});

const getReceiverParcels = catchAsync(async (req: Request, res: Response) => {
  const receiverId = req.user?.id;
  if (!receiverId) throw new AppError(httpStatus.UNAUTHORIZED, 'Receiver ID missing');
  
  const options = req.query;
  const result = await ParcelService.getReceiverParcels(receiverId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Receiver parcels retrieved successfully',
    data: result.data,
    meta: {
      page: Number(options.page) || 1,
      limit: Number(options.limit) || 10,
      total: result.total,
    }
  });
});

const getParcelById = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const parcel = await ParcelService.getParcelById(parcelId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel retrieved successfully',
    data: parcel,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.id;
  if (!senderId) throw new AppError(httpStatus.UNAUTHORIZED, 'Sender ID missing');
  
  const parcelId = req.params.id;
  const parcel = await ParcelService.cancelParcel(parcelId, senderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel cancelled successfully',
    data: parcel,
  });
});

const confirmDelivery = catchAsync(async (req: Request, res: Response) => {
  const receiverId = req.user?.id;
  if (!receiverId) throw new AppError(httpStatus.UNAUTHORIZED, 'Receiver ID missing');

  const parcelId = req.params.id;
  const parcel = await ParcelService.confirmDelivery(parcelId, receiverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery confirmed successfully',
    data: parcel,
  });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.id;
  if (!adminId) throw new AppError(httpStatus.UNAUTHORIZED, 'Admin ID missing');

  const parcelId = req.params.id;
  const { status, note, location, isBlocked } = req.body;

  const parcel = await ParcelService.updateParcelStatus(
    parcelId,
    status,
    adminId,
    note,
    location,
    isBlocked
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel status updated successfully',
    data: parcel,
  });
});

// <-- Block Parcel Controller Added -->
const blockParcel = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new AppError(httpStatus.UNAUTHORIZED, 'Admin ID missing');
  
    const parcelId = req.params.id;
    const parcel = await ParcelService.updateParcelStatus(
      parcelId,
      'BLOCKED', // status
      adminId,
      'Parcel blocked by admin', // note
      undefined, // location
      true // isBlocked flag
    );
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Parcel blocked successfully',
      data: parcel,
    });
  });
  
// <-- Unblock Parcel Controller Added -->
const unblockParcel = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new AppError(httpStatus.UNAUTHORIZED, 'Admin ID missing');

    const parcelId = req.params.id;
    const parcel = await ParcelService.updateParcelStatus(
        parcelId,
        'REQUESTED', // status (or a more appropriate status after unblocking)
        adminId,
        'Parcel unblocked by admin', // note
        undefined, // location
        false // isBlocked flag
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel unblocked successfully',
        data: parcel,
    });
});

// <-- Get Delivery History Controller Added -->
const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, 'User ID missing');
  
    const parcels = await ParcelService.getDeliveryHistory(userId, role);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delivery history retrieved successfully',
      data: parcels,
    });
});

const getParcelByTrackingId = catchAsync(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const parcel = await ParcelService.getParcelByTrackingId(trackingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel found by tracking ID',
    data: parcel,
  });
});

const getParcelStatusLog = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.parcelId;
  const log = await ParcelService.getParcelStatusLog(parcelId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,

    message: 'Parcel status log retrieved successfully',
    data: log,
  });
});

export const ParcelController = {
  createParcel,
  getAllParcels,
  getSenderParcels,
  getReceiverParcels,
  getParcelById,
  cancelParcel,
  confirmDelivery,
  updateParcelStatus,
  getParcelByTrackingId,
  getParcelStatusLog,
  getDeliveryHistory, // <-- Added to export
  blockParcel,        // <-- Added to export
  unblockParcel,      // <-- Added to export
};