"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const parcel_model_1 = require("./parcel.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Helper to create a status log entry
function createStatusLog(status, updatedBy, note, location) {
    return {
        status,
        updatedAt: new Date(),
        updatedBy,
        note,
        location,
    };
}
// Create a new parcel by sender
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const statusLogs = [
        createStatusLog('REQUESTED', senderId, 'Parcel requested'),
    ];
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `TRK-${dateStr}-${randomNum}`;
    const parcelData = Object.assign(Object.assign({}, payload), { sender: senderId, status: 'REQUESTED', statusLogs,
        trackingId, isBlocked: false });
    const parcel = yield parcel_model_1.Parcel.create(parcelData);
    return parcel;
});
const getAllParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.find();
});
const getSenderParcels = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.find({ sender: senderId });
});
const getReceiverParcels = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.find({ receiver: receiverId });
});
// <-- getParcelById added here -->
const getParcelById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    return parcel;
});
const cancelParcel = (parcelId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    if (parcel.sender.toString() !== senderId)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Not authorized to cancel this parcel');
    if (['DISPATCHED', 'IN_TRANSIT', 'DELIVERED'].includes(parcel.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot cancel parcel after it has been dispatched');
    }
    if (parcel.status === 'CANCELLED') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Parcel is already cancelled');
    }
    parcel.status = 'CANCELLED';
    parcel.statusLogs.push(createStatusLog('CANCELLED', senderId, 'Parcel cancelled by sender'));
    yield parcel.save();
    return parcel;
});
const confirmDelivery = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    if (parcel.receiver.toString() !== receiverId)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Not authorized to confirm delivery');
    if (parcel.status === 'DELIVERED') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Parcel is already delivered');
    }
    parcel.status = 'DELIVERED';
    parcel.statusLogs.push(createStatusLog('DELIVERED', receiverId, 'Delivery confirmed by receiver'));
    yield parcel.save();
    return parcel;
});
const updateParcelStatus = (parcelId, status, updatedBy, note, location, block) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    parcel.status = status;
    parcel.isBlocked = block !== null && block !== void 0 ? block : parcel.isBlocked;
    parcel.statusLogs.push(createStatusLog(status, updatedBy, note, location));
    yield parcel.save();
    return parcel;
});
const getDeliveryHistory = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = { status: 'DELIVERED' };
    if (role === 'SENDER') {
        filter.sender = userId;
    }
    else if (role === 'RECEIVER') {
        filter.receiver = userId;
    }
    return yield parcel_model_1.Parcel.find(filter).sort({ updatedAt: -1 });
});
const getParcelByTrackingId = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId });
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    return parcel;
});
const getParcelStatusLog = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId).populate('statusLogs.updatedBy', 'role');
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    return parcel.statusLogs;
});
exports.ParcelService = {
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
