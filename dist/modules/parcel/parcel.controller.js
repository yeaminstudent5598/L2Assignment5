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
exports.ParcelController = void 0;
const parcel_service_1 = require("./parcel.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.ParcelController = {
    createParcel: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!senderId)
            throw new Error('Sender ID missing');
        const parcelData = req.body;
        const parcel = yield parcel_service_1.ParcelService.createParcel(parcelData, senderId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            success: true,
            message: 'Parcel created successfully',
            data: parcel,
        });
    })),
    getAllParcels: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const parcels = yield parcel_service_1.ParcelService.getAllParcels();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'All parcels retrieved',
            data: parcels,
        });
    })),
    getSenderParcels: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!senderId)
            throw new Error('Sender ID missing');
        const parcels = yield parcel_service_1.ParcelService.getSenderParcels(senderId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Sender parcels retrieved',
            data: parcels,
        });
    })),
    getReceiverParcels: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const receiverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!receiverId)
            throw new Error('Receiver ID missing');
        const parcels = yield parcel_service_1.ParcelService.getReceiverParcels(receiverId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Receiver parcels retrieved',
            data: parcels,
        });
    })),
    cancelParcel: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!senderId)
            throw new Error('Sender ID missing');
        const parcelId = req.params.id;
        const parcel = yield parcel_service_1.ParcelService.cancelParcel(parcelId, senderId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel cancelled successfully',
            data: parcel,
        });
    })),
    confirmDelivery: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const receiverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!receiverId)
            throw new Error('Receiver ID missing');
        const parcelId = req.params.id;
        const parcel = yield parcel_service_1.ParcelService.confirmDelivery(parcelId, receiverId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Delivery confirmed successfully',
            data: parcel,
        });
    })),
    updateParcelStatus: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId)
            throw new Error('Admin ID missing');
        const parcelId = req.params.id;
        const { status, note, location, isBlocked } = req.body;
        const parcel = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, status, adminId, note, location, isBlocked);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel status updated successfully',
            data: parcel,
        });
    })),
    blockParcel: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId)
            throw new Error('Admin ID missing');
        const parcelId = req.params.id;
        const parcel = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, 'BLOCKED', adminId, 'Parcel blocked', undefined, true);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel blocked successfully',
            data: parcel,
        });
    })),
    unblockParcel: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId)
            throw new Error('Admin ID missing');
        const parcelId = req.params.id;
        const parcel = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, 'REQUESTED', adminId, 'Parcel unblocked', undefined, false);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel unblocked successfully',
            data: parcel,
        });
    })),
    getDeliveryHistory: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!userId)
            throw new Error('User ID missing');
        const parcels = yield parcel_service_1.ParcelService.getDeliveryHistory(userId, role);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Delivery history retrieved successfully',
            data: parcels,
        });
    })),
    getParcelByTrackingId: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const trackingId = req.params.trackingId;
        if (!trackingId)
            throw new Error('Tracking ID missing');
        const parcel = yield parcel_service_1.ParcelService.getParcelByTrackingId(trackingId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel found by tracking ID',
            data: parcel,
        });
    })),
    getParcelById: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const parcelId = req.params.id;
        if (!parcelId)
            throw new Error('Parcel ID missing');
        const parcel = yield parcel_service_1.ParcelService.getParcelById(parcelId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel retrieved successfully',
            data: parcel,
        });
    })),
    getParcelStatusLog: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const parcelId = req.params.parcelId;
        if (!parcelId)
            throw new Error('Parcel ID missing');
        const parcel = yield parcel_service_1.ParcelService.getParcelStatusLog(parcelId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Parcel status log retrieved successfully',
            data: parcel,
        });
    })),
};
