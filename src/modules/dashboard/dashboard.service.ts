import mongoose from 'mongoose';
import { Parcel } from '../parcel/parcel.model';

// For Admin: Get overview stats for all parcels
const getAdminOverviewStats = async () => {
  const totalParcels = await Parcel.countDocuments();
  const delivered = await Parcel.countDocuments({ status: 'DELIVERED' });
  const inTransit = await Parcel.countDocuments({ status: 'IN_TRANSIT' });
  const requested = await Parcel.countDocuments({ status: 'REQUESTED' });
  const cancelled = await Parcel.countDocuments({ status: 'CANCELLED' });

  return { totalParcels, delivered, inTransit, requested, cancelled };
};

// For Sender: Get stats for a specific sender
const getSenderStats = async (senderId: string) => {
  const stats = await Parcel.aggregate([
    { $match: { sender: new mongoose.Types.ObjectId(senderId) } },
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


export const DashboardService = {
  getAdminOverviewStats,
  getSenderStats,
};