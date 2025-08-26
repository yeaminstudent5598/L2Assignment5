import mongoose, { Types } from 'mongoose';
import { Parcel } from './parcel.model';
import { IParcel, ParcelStatus, IParcelStatusLog } from './parcel.interface';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

// Helper to create a status log entry
function createStatusLog(
    status: ParcelStatus,
    updatedBy: string | Types.ObjectId,
    note?: string,
    location?: string
): IParcelStatusLog {
    return { status, updatedAt: new Date(), updatedBy, note, location };
}

// Create a new parcel by sender
const createParcel = async (
    payload: Partial<IParcel>,
    senderId: string
): Promise<IParcel> => {
    // ... no changes needed here ...
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
    
      const newParcel = await Parcel.create(parcelData);
      const populatedParcel = await getParcelById((newParcel._id as any).toString());
      return populatedParcel;
};

// UPDATED to support pagination and filtering for Admin
const getAllParcels = async (options: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
  }): Promise<{ data: IParcel[]; total: number }> => {
    const { page = 1, limit = 10, searchTerm, status } = options;
    const skip = (page - 1) * limit;
  
    const filter: any = {};
  
    if (status) {
      filter.status = status;
    }
  
    if (searchTerm) {
      filter.$or = [
        { trackingId: { $regex: searchTerm, $options: 'i' } },
        { deliveryAddress: { $regex: searchTerm, $options: 'i' } },
      ];
    }
  
    const data = await Parcel.find(filter)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    const total = await Parcel.countDocuments(filter);
  
    return { data, total };
  };

// CORRECTLY UPDATED for Sender
const getSenderParcels = async (
    senderId: string,
    options: { page?: number; limit?: number; searchTerm?: string; status?: string; }
): Promise<{ data: IParcel[]; total: number }> => {
    // ... this function is correct as you provided ...
    const { page = 1, limit = 5, searchTerm, status } = options;
  const skip = (page - 1) * limit;

  const filter: any = { sender: new Types.ObjectId(senderId) };

  if (status) {
    filter.status = status;
  }

  if (searchTerm) {
    filter.$or = [
      { trackingId: { $regex: searchTerm, $options: 'i' } },
      { deliveryAddress: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  const data = await Parcel.find(filter)
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Parcel.countDocuments(filter);

  return { data, total };
};

// UPDATED to support pagination for Receiver
const getReceiverParcels = async (
    receiverId: string,
    options: { page?: number; limit?: number; searchTerm?: string; status?: string; }
  ): Promise<{ data: IParcel[]; total: number }> => {
    const { page = 1, limit = 10, searchTerm, status } = options;
    const skip = (page - 1) * limit;
  
    const filter: any = { receiver: new Types.ObjectId(receiverId) };
  
    if (status) {
      filter.status = status;
    }
  
    if (searchTerm) {
      filter.$or = [{ trackingId: { $regex: searchTerm, $options: 'i' } }];
    }
  
    const data = await Parcel.find(filter)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    const total = await Parcel.countDocuments(filter);
  
    return { data, total };
};

// ... All other functions (getParcelById, cancelParcel, etc.) remain unchanged ...
// Get a single parcel by ID with populated data
const getParcelById = async (id: string): Promise<IParcel> => {
    const parcel = await Parcel.findById(id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    return parcel;
  };
  
  // Cancel a parcel
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
    return parcel.populate(['sender', 'receiver']);
  };
  
  // Confirm delivery of a parcel
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
    return parcel.populate(['sender', 'receiver']);
  };
  
  // Update parcel status (by admin)
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
  
    return parcel.populate(['sender', 'receiver']);
  };
  
  // Get delivery history with populated data
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
  
    return await Parcel.find(filter)
      .sort({ updatedAt: -1 })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
  };
  
  // Get a single parcel by tracking ID with populated data
  const getParcelByTrackingId = async (
    trackingId: string
  ): Promise<IParcel> => {
    const parcel = await Parcel.findOne({ trackingId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    return parcel;
  };
  
  // Get status log for a parcel
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
  
  // Get stats for a specific sender
  const getSenderStats = async (senderId: string) => {
      const stats = await Parcel.aggregate([
        { $match: { sender: new Types.ObjectId(senderId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            totalParcels: { $sum: '$count' },
            statusCounts: { $push: { status: '$_id', count: '$count' } },
          },
        },
      ]);
    
      if (stats.length === 0) {
        return { totalParcels: 0, statuses: {} };
      }
    
      const result = {
        totalParcels: stats[0].totalParcels,
        statuses: stats[0].statusCounts.reduce((acc: any, item: any) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
      };
    
      return result;
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
  getSenderStats,
};