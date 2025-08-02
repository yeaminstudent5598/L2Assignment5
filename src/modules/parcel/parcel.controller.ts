import { Request, Response } from 'express';
import { ParcelService } from './parcel.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

export const ParcelController = {
  createParcel: catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user?.id;
    if (!senderId) throw new Error('Sender ID missing');

    const parcelData = req.body;
    const parcel = await ParcelService.createParcel(parcelData, senderId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Parcel created successfully',
      data: parcel,
    });
  }),

  getAllParcels: catchAsync(async (req: Request, res: Response) => {
    const parcels = await ParcelService.getAllParcels();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All parcels retrieved',
      data: parcels,
    });
  }),

  getSenderParcels: catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user?.id;
    if (!senderId) throw new Error('Sender ID missing');

    const parcels = await ParcelService.getSenderParcels(senderId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sender parcels retrieved',
      data: parcels,
    });
  }),

  getReceiverParcels: catchAsync(async (req: Request, res: Response) => {
    const receiverId = req.user?.id;
    if (!receiverId) throw new Error('Receiver ID missing');

    const parcels = await ParcelService.getReceiverParcels(receiverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Receiver parcels retrieved',
      data: parcels,
    });
  }),

  cancelParcel: catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user?.id;
    if (!senderId) throw new Error('Sender ID missing');

    const parcelId = req.params.id;
    const parcel = await ParcelService.cancelParcel(parcelId, senderId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Parcel cancelled successfully',
      data: parcel,
    });
  }),

  confirmDelivery: catchAsync(async (req: Request, res: Response) => {
    const receiverId = req.user?.id;
    if (!receiverId) throw new Error('Receiver ID missing');

    const parcelId = req.params.id;
    const parcel = await ParcelService.confirmDelivery(parcelId, receiverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delivery confirmed successfully',
      data: parcel,
    });
  }),

  updateParcelStatus: catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new Error('Admin ID missing');

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
  }),

  blockParcel: catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new Error('Admin ID missing');

    const parcelId = req.params.id;
    const parcel = await ParcelService.updateParcelStatus(
      parcelId,
      'BLOCKED',
      adminId,
      'Parcel blocked',
      undefined,
      true
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Parcel blocked successfully',
      data: parcel,
    });
  }),

  unblockParcel: catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throw new Error('Admin ID missing');

    const parcelId = req.params.id;
    const parcel = await ParcelService.updateParcelStatus(
      parcelId,
      'REQUESTED',
      adminId,
      'Parcel unblocked',
      undefined,
      false
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Parcel unblocked successfully',
      data: parcel,
    });
  }),

  getDeliveryHistory: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) throw new Error('User ID missing');

    const parcels = await ParcelService.getDeliveryHistory(userId, role);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delivery history retrieved successfully',
      data: parcels,
    });
  }),

  getParcelByTrackingId: catchAsync(async (req: Request, res: Response) => {
    const trackingId = req.params.trackingId;
    if (!trackingId) throw new Error('Tracking ID missing');

    const parcel = await ParcelService.getParcelByTrackingId(trackingId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Parcel found by tracking ID',
      data: parcel,
    });
  }),
  getParcelById: catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  if (!parcelId) throw new Error('Parcel ID missing');

  const parcel = await ParcelService.getParcelById(parcelId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel retrieved successfully',
    data: parcel,
  });
}),


  getParcelStatusLog: catchAsync(async (req: Request, res: Response) => {
    const parcelId = req.params.parcelId;
    if (!parcelId) throw new Error('Parcel ID missing');

    const parcel = await ParcelService.getParcelStatusLog(parcelId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Parcel status log retrieved successfully',
      data: parcel,
    });
  }),
};
