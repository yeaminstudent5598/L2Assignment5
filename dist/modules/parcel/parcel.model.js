"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const ParcelStatusLogSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { _id: false });
const ParcelSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.Parcel = (0, mongoose_1.model)('Parcel', ParcelSchema);
