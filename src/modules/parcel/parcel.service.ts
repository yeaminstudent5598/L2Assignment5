import { Parcel } from './parcel.model';
import { IParcel, ParcelStatus, IParcelStatusLog } from './parcel.interface';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';

// Helper to create a status log entry
function createStatusLog(
  status: ParcelStatus,
  updatedBy: string | Types.ObjectId,
  note?: string,
  location?: string
): IParcelStatusLog {
  return {
    status,
    updatedAt: new Date(),
    updatedBy,
    note,
    location,
  };
}

// Create a new parcel by sender
const createParcel = async (
  payload: Partial<IParcel>,
  senderId: string
): Promise<IParcel> => {
  const statusLogs: IParcelStatusLog[] = [
    createStatusLog('REQUESTED', senderId, 'Parcel requested'),
  ];

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const trackingId = `TRK-${dateStr}-${randomNum}`;

  const parcelData: Partial<IParcel> = {
    ...payload,
    sender: senderId,
    status: 'REQUESTED',
    statusLogs,
    trackingId,
    isBlocked: false,
  };

  const parcel = await Parcel.create(parcelData);
  return parcel;
};

const getAllParcels = async (): Promise<IParcel[]> => {
  return await Parcel.find();
};

const getSenderParcels = async (senderId: string): Promise<IParcel[]> => {
  return await Parcel.find({ sender: senderId });
};

const getReceiverParcels = async (receiverId: string): Promise<IParcel[]> => {
  return await Parcel.find({ receiver: receiverId });
};

// <-- getParcelById added here -->
const getParcelById = async (id: string): Promise<IParcel> => {
  const parcel = await Parcel.findById(id);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  return parcel;
};

const cancelParcel = async (
  parcelId: string,
  senderId: string
): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  if (parcel.sender.toString() !== senderId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Not authorized to cancel this parcel'
    );

  if (['DISPATCHED', 'IN_TRANSIT', 'DELIVERED'].includes(parcel.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot cancel parcel after it has been dispatched'
    );
  }

  if (parcel.status === 'CANCELLED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel is already cancelled');
  }

  parcel.status = 'CANCELLED';
  parcel.statusLogs.push(
    createStatusLog('CANCELLED', senderId, 'Parcel cancelled by sender')
  );
  await parcel.save();
  return parcel;
};

const confirmDelivery = async (
  parcelId: string,
  receiverId: string
): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  if (parcel.receiver.toString() !== receiverId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Not authorized to confirm delivery'
    );

  if (parcel.status === 'DELIVERED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel is already delivered');
  }

  parcel.status = 'DELIVERED';
  parcel.statusLogs.push(
    createStatusLog('DELIVERED', receiverId, 'Delivery confirmed by receiver')
  );
  await parcel.save();
  return parcel;
};

const updateParcelStatus = async (
  parcelId: string,
  status: ParcelStatus,
  updatedBy: string,
  note?: string,
  location?: string,
  block?: boolean
): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');

  parcel.status = status;
  parcel.isBlocked = block ?? parcel.isBlocked;
  parcel.statusLogs.push(createStatusLog(status, updatedBy, note, location));
  await parcel.save();

  return parcel;
};

const getDeliveryHistory = async (
  userId: string,
  role?: string
): Promise<IParcel[]> => {
  const filter: any = { status: 'DELIVERED' };

  if (role === 'SENDER') {
    filter.sender = userId;
  } else if (role === 'RECEIVER') {
    filter.receiver = userId;
  }

  return await Parcel.find(filter).sort({ updatedAt: -1 });
};

const getParcelByTrackingId = async (
  trackingId: string
): Promise<IParcel> => {
  const parcel = await Parcel.findOne({ trackingId });
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  return parcel;
};

const getParcelStatusLog = async (
  parcelId: string
): Promise<IParcelStatusLog[]> => {
  const parcel = await Parcel.findById(parcelId).populate(
    'statusLogs.updatedBy',
    'role'
  );
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  return parcel.statusLogs;
};

export const ParcelService = {
  createParcel,
  getAllParcels,
  getSenderParcels,
  getReceiverParcels,
  getParcelById, 
  cancelParcel,
  confirmDelivery,
  updateParcelStatus,
  getDeliveryHistory,
  getParcelByTrackingId,
  getParcelStatusLog,
};
