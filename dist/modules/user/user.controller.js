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
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// Your handlers
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Users retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_service_1.UserService.getSingleUser(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User retrieved successfully',
        data: user,
    });
}));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'User created successfully',
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const authReq = req;
    if (!((_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User not authenticated');
    }
    if (authReq.user.role !== 'ADMIN' &&
        authReq.user.id !== id) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can't update this profile");
    }
    const updatedUser = yield user_service_1.UserService.updateUser(id, req.body, authReq.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User updated successfully',
        data: updatedUser,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedUser = yield user_service_1.UserService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User deleted successfully',
        data: deletedUser,
    });
}));
const getMyParcels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new Error('User ID missing');
    const result = yield user_service_1.UserService.getParcelsBySender(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Your parcels retrieved successfully',
        data: result,
    });
}));
const getMyIncomingParcels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new Error('User ID missing');
    const result = yield user_service_1.UserService.getParcelsForReceiver(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Incoming parcels retrieved successfully',
        data: result,
    });
}));
const confirmParcelDelivery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parcelId } = req.params;
    const result = yield user_service_1.UserService.confirmParcelDelivery(parcelId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Parcel delivery confirmed',
        data: result,
    });
}));
const blockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserService.blockUser(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User blocked successfully',
        data: result,
    });
}));
const getMeProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new Error('User ID missing');
    const user = yield user_service_1.UserService.getSingleUser(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User profile retrieved successfully',
        data: user,
    });
}));
const unblockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserService.unblockUser(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User unblocked successfully',
        data: result,
    });
}));
exports.UserController = {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    getMyParcels,
    getMyIncomingParcels,
    confirmParcelDelivery,
    blockUser,
    unblockUser,
    getMeProfile,
};
