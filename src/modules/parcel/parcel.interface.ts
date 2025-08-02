// src/modules/parcel/parcel.interface.ts

import { Document } from 'mongoose';
import { Types } from 'mongoose';

// Valid parcel statuses in the flow you mentioned
export type ParcelStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'BLOCKED';

// One status log entry in the history
export interface IParcelStatusLog {
  status: ParcelStatus;
  updatedAt: Date;          // when status was updated
  updatedBy: Types.ObjectId | string;  // admin, sender or system ID
  location?: string;        // optional, where parcel was scanned
  note?: string;            // optional notes/comments
}

// Main parcel interface
export interface IParcel extends Document {
  sender: Types.ObjectId | string;    // user ID of sender
  receiver: Types.ObjectId | string;  // user ID of receiver

  deliveryAddress: string;             // delivery location
  pickupAddress?: string;              // optional pickup location

  weight: number;                     // weight in kg or grams
  price: number;                      // delivery fee (could be calculated)

  trackingId: string;                 // unique tracking number e.g. TRK-20250801-123456

  status: ParcelStatus;               // current status
  statusLogs: IParcelStatusLog[];    // history of status changes

  isBlocked?: boolean;                // parcel can be blocked by admin

  createdAt?: Date;
  updatedAt?: Date;
}
