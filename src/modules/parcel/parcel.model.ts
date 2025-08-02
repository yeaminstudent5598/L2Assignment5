import mongoose, { Schema, Document, model } from 'mongoose';
import { IParcel, IParcelStatusLog, ParcelStatus } from './parcel.interface';

const ParcelStatusLogSchema = new Schema<IParcelStatusLog>(
  {
    status: {
      type: String,
      enum: [
        'REQUESTED',
        'APPROVED',
        'DISPATCHED',
        'IN_TRANSIT',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
        'BLOCKED',
      ],
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const ParcelSchema = new Schema<IParcel>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'REQUESTED',
        'APPROVED',
        'DISPATCHED',
        'IN_TRANSIT',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
        'BLOCKED',
      ],
      default: 'REQUESTED',
      required: true,
    },
    statusLogs: {
      type: [ParcelStatusLogSchema],
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Parcel = model<IParcel & Document>('Parcel', ParcelSchema);
