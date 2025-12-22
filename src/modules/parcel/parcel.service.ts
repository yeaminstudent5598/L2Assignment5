import mongoose, { Types } from 'mongoose';
import { Parcel } from './parcel.model';
import { IParcel, ParcelStatus, IParcelStatusLog } from './parcel.interface';
import { Coupon } from '../coupon/coupon.model'; // Coupon model import
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

/**
 * 1. Create a new parcel by sender (With Coupon Logic)
 */
const createParcel = async (
    payload: Partial<IParcel> & { couponCode?: string },
    senderId: string
): Promise<IParcel> => {
    let finalPrice = payload.price || 0;

    // --- Coupon Logic Start ---
    if (payload.couponCode) {
        const coupon = await Coupon.findOne({ 
            code: payload.couponCode.toUpperCase(), 
            isActive: true 
        });

        if (!coupon) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired coupon code');
        }

        // Apply discount and ensure price doesn't go below 0
        finalPrice = Math.max(0, finalPrice - coupon.discountAmount);
    }
    // --- Coupon Logic End ---

    const statusLogs: IParcelStatusLog[] = [
        createStatusLog('REQUESTED', senderId, 'Parcel requested'),
    ];
    
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `TRK-${dateStr}-${randomNum}`;
    
    const parcelData = {
        ...payload,
        price: finalPrice, // Set the discounted price
        sender: senderId,
        status: 'REQUESTED' as ParcelStatus,
        statusLogs,
        trackingId,
        isBlocked: false,
    };
    
    const newParcel = await Parcel.create(parcelData);
    return await getParcelById((newParcel._id as any).toString());
};

/**
 * 2. Get all parcels (Admin - with Pagination & Search)
 */
const getAllParcels = async (options: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
}): Promise<{ data: IParcel[]; total: number }> => {
    const { page = 1, limit = 10, searchTerm, status } = options;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
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

/**
 * 3. Get Sender's own parcels
 */
const getSenderParcels = async (
    senderId: string,
    options: { page?: number; limit?: number; searchTerm?: string; status?: string; }
): Promise<{ data: IParcel[]; total: number }> => {
    const { page = 1, limit = 5, searchTerm, status } = options;
    const skip = (page - 1) * limit;

    const filter: any = { sender: new Types.ObjectId(senderId) };

    if (status) filter.status = status;
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

/**
 * 4. Get Receiver's incoming parcels
 */
const getReceiverParcels = async (
    receiverId: string,
    options: { page?: number; limit?: number; searchTerm?: string; status?: string; }
): Promise<{ data: IParcel[]; total: number }> => {
    const { page = 1, limit = 10, searchTerm, status } = options;
    const skip = (page - 1) * limit;
  
    const filter: any = { receiver: new Types.ObjectId(receiverId) };
  
    if (status) filter.status = status;
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

/**
 * 5. Get a single parcel by ID
 */
const getParcelById = async (id: string): Promise<IParcel> => {
    const parcel = await Parcel.findById(id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email');
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    return parcel;
};

/**
 * 6. Cancel a parcel (Sender)
 */
const cancelParcel = async (parcelId: string, senderId: string): Promise<IParcel> => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    if (parcel.sender.toString() !== senderId)
        throw new AppError(httpStatus.FORBIDDEN, 'Not authorized');

    if (['DISPATCHED', 'IN_TRANSIT', 'DELIVERED'].includes(parcel.status)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot cancel after dispatch');
    }

    parcel.status = 'CANCELLED';
    parcel.statusLogs.push(createStatusLog('CANCELLED', senderId, 'Cancelled by sender'));
    await parcel.save();
    return parcel.populate(['sender', 'receiver']);
};

/**
 * 7. Confirm delivery (Receiver)
 */
const confirmDelivery = async (parcelId: string, receiverId: string): Promise<IParcel> => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    if (parcel.receiver.toString() !== receiverId)
        throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized');

    parcel.status = 'DELIVERED';
    parcel.statusLogs.push(createStatusLog('DELIVERED', receiverId, 'Delivery confirmed by receiver'));
    await parcel.save();
    return parcel.populate(['sender', 'receiver']);
};

/**
 * 8. Update parcel status (Admin)
 */
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
    if (block !== undefined) parcel.isBlocked = block;
    parcel.statusLogs.push(createStatusLog(status, updatedBy, note, location));
    await parcel.save();
  
    return parcel.populate(['sender', 'receiver']);
};

/**
 * 9. Get Delivery History
 */
const getDeliveryHistory = async (userId: string, role?: string): Promise<IParcel[]> => {
    const filter: any = { status: 'DELIVERED' };
    if (role === 'SENDER') filter.sender = userId;
    else if (role === 'RECEIVER') filter.receiver = userId;
  
    return await Parcel.find(filter)
        .sort({ updatedAt: -1 })
        .populate('sender', 'name email')
        .populate('receiver', 'name email');
};

/**
 * 10. Get Parcel by Tracking ID
 */
const getParcelByTrackingId = async (trackingId: string): Promise<IParcel> => {
    const parcel = await Parcel.findOne({ trackingId })
        .populate('sender', 'name email')
        .populate('receiver', 'name email');
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Tracking ID invalid');
    return parcel;
};

/**
 * 11. Get Status Log for a Parcel
 */
const getParcelStatusLog = async (parcelId: string): Promise<IParcelStatusLog[]> => {
    const parcel = await Parcel.findById(parcelId).populate('statusLogs.updatedBy', 'role name');
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    return parcel.statusLogs;
};

/**
 * 12. Get Stats for Sender
 */
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
    
    if (stats.length === 0) return { totalParcels: 0, statuses: {} };
    
    return {
        totalParcels: stats[0].totalParcels,
        statuses: stats[0].statusCounts.reduce((acc: any, item: any) => {
            acc[item.status] = item.count;
            return acc;
        }, {}),
    };
};

const updateParcelLocation = async (id: string, lat: number, lng: number) => {
  return await Parcel.findByIdAndUpdate(
    id,
    { currentLocation: { lat, lng } },
    { new: true }
  );
};


const getActiveParcelLocations = async () => {
  // শুধুমাত্র DISPATCHED এবং IN_TRANSIT স্ট্যাটাসের পার্সেলগুলো ফিল্টার করা হচ্ছে
  const parcels = await Parcel.find({
    status: { $in: ['DISPATCHED', 'IN_TRANSIT'] },
    'currentLocation.lat': { $exists: true },
  })
  .select('trackingId currentLocation status receiver')
  .populate('receiver', 'name'); // রিসিভারের নাম দেখানোর জন্য পপুলেট করা

  return parcels;
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
    updateParcelLocation,
    getActiveParcelLocations,
};