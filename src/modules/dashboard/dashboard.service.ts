import mongoose from 'mongoose';
import { Parcel } from '../parcel/parcel.model';

// For Admin: Get overview stats for all parcels
const getAdminStats = async () => {
  const totalParcels = await Parcel.countDocuments();
  const delivered = await Parcel.countDocuments({ status: 'DELIVERED' });
  const inTransit = await Parcel.countDocuments({ status: 'IN_TRANSIT' });
  const requested = await Parcel.countDocuments({ status: 'REQUESTED' });

  return { totalParcels, delivered, inTransit, requested };
};

// For Sender: Get stats for a specific sender
const getSenderStats = async (senderId: string) => {
  const objectId = new mongoose.Types.ObjectId(senderId);
  const stats = await Parcel.aggregate([
    { $match: { sender: objectId } },
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

// For Receiver: Get stats for a specific receiver
const getReceiverStats = async (receiverId: string) => {
  const objectId = new mongoose.Types.ObjectId(receiverId);
  const stats = await Parcel.aggregate([
    { $match: { receiver: objectId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const totalReceived = stats.find(s => s._id === 'DELIVERED')?.count || 0;
  const inTransit = stats.reduce((sum, s) => {
    if (s._id !== 'DELIVERED' && s._id !== 'CANCELLED') {
      return sum + s.count;
    }
    return sum;
  }, 0);

  return { totalReceived, inTransit };
};

// ✅ For Admin Chart: Get monthly parcel trends
const getMonthlyTrends = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = await Parcel.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  
    return monthlyData.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      parcels: item.count,
    }));
};

export const DashboardService = {
  getAdminStats,
  getSenderStats,
  getReceiverStats,
  getMonthlyTrends, // <-- নতুন ফাংশনটি এক্সপোর্ট করা হয়েছে
};