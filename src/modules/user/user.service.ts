import { User } from './user.model';
import { IUser } from './user.interface';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from './user.constant';
import { Parcel } from '../parcel/parcel.model';

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  if (!email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND));
  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  return user;
};

const getAllUsers = async (options: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
}): Promise<{ data: IUser[]; total: number }> => {
  const { page = 1, limit = 5, searchTerm, role } = options;
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (role) {
    filter.role = role;
  }

  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  const data = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return { data, total };
};

const getReceivers = async () => {
  const receivers = await User.find({ role: 'RECEIVER', isBlocked: false }).select('-password');
  return receivers;
};


const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (payload.role) {
    // Normalize role strings to uppercase to avoid case mismatch
    const requesterRole = (decodedToken.role || '').toUpperCase();

    if (requesterRole !== USER_ROLE.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to change roles');
    }

    if (payload.role.toUpperCase() === USER_ROLE.ADMIN && requesterRole !== USER_ROLE.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'Only admin can assign admin role');
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found or already deleted');
  return user;
};

const blockUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found or already blocked');
  return user;
};

const unblockUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found or already unblocked');
  return user;
};

const getParcelsBySender = async (userId: string) => {
  const parcels = await Parcel.find({ sender: userId });
  return parcels;
};

const getParcelsForReceiver = async (userId: string) => {
  const parcels = await Parcel.find({ receiver: userId });
  return parcels;
};

const confirmParcelDelivery = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');

  parcel.status = 'DELIVERED';
  await parcel.save();

  return parcel;
};

export const UserService = {
  createUser,
  getAllUsers,
  getReceivers,
  getSingleUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  getParcelsBySender,
  getParcelsForReceiver,
  confirmParcelDelivery,
};
